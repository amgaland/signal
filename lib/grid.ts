import { latLngToCell, cellToLatLng } from "h3-js";
import type { Sample } from "./mockData";

export interface GridCell {
  cellId: string;
  lat: number;
  lon: number;
  avgDbm: number;
  avgLevel: number;
  sampleCount: number;
  dominantCarrier: string;
  dominantNetwork: string;
  latestTs?: string;
  oldestTs?: string;
}

/**
 * Above this zoom level we render individual sample dots.
 * Below it we render H3 hexagons.
 */
export const GRID_ZOOM_THRESHOLD = 14;

/**
 * Maps Leaflet zoom → H3 resolution.
 * Higher resolution = smaller hexagons.
 *
 * Approximate hex edge lengths:
 *   res 5 → ~87 km   res 6 → ~33 km   res 7 → ~12 km
 *   res 8 →  ~4 km   res 9 → ~1.5 km
 */
export function zoomToH3Resolution(zoom: number): number {
  if (zoom <= 9)  return 5;
  if (zoom <= 10) return 6;
  if (zoom <= 11) return 7;
  if (zoom <= 12) return 8;
  return 9;
}

/** Aggregate an array of samples into H3 hexagonal grid cells. */
export function aggregateToH3(samples: Sample[], resolution: number): GridCell[] {
  const buckets = new Map<string, Sample[]>();

  for (const s of samples) {
    const cellId = latLngToCell(s.lat, s.lon, resolution);
    const bucket = buckets.get(cellId);
    if (bucket) bucket.push(s);
    else buckets.set(cellId, [s]);
  }

  return Array.from(buckets.entries()).map(([cellId, bucket]) => {
    const [lat, lon] = cellToLatLng(cellId);

    const avgDbm = Math.round(
      bucket.reduce((s, x) => s + x.cellular_dbm, 0) / bucket.length
    );
    const avgLevel =
      bucket.reduce((s, x) => s + x.cellular_level, 0) / bucket.length;

    const carrierTally: Record<string, number> = {};
    const networkTally: Record<string, number> = {};
    for (const s of bucket) {
      carrierTally[s.carrier] = (carrierTally[s.carrier] ?? 0) + 1;
      networkTally[s.network_type] = (networkTally[s.network_type] ?? 0) + 1;
    }
    const dominantCarrier = Object.entries(carrierTally).sort((a, b) => b[1] - a[1])[0][0];
    const dominantNetwork = Object.entries(networkTally).sort((a, b) => b[1] - a[1])[0][0];

    const timestamps = bucket.map((s) => s.ts).sort();
    const oldestTs = timestamps[0];
    const latestTs = timestamps[timestamps.length - 1];

    return { cellId, lat, lon, avgDbm, avgLevel, sampleCount: bucket.length, dominantCarrier, dominantNetwork, latestTs, oldestTs };
  });
}

/** Round avgLevel (0–5) to the nearest integer level for color lookup. */
export function levelFromAvg(avg: number): 1 | 2 | 3 | 4 | 5 {
  const r = Math.round(avg);
  return (Math.max(1, Math.min(5, r)) as 1 | 2 | 3 | 4 | 5);
}
