/**
 * API layer — currently backed by mock data.
 * When the real backend is ready, replace the body of `fetchCoverage`
 * with a real fetch() call using the same query params.
 *
 * Real endpoint:
 *   GET /api/coverage?bbox=sw_lat,sw_lon,ne_lat,ne_lon&zoom=12&carrier=...&network_type=...&level_min=1&level_max=5
 *
 * Backend decides mode (grid | samples) based on zoom.
 * Frontend just sends params and renders whatever comes back.
 */

import { mockSamples } from "./mockData";
import { aggregateToH3, zoomToH3Resolution, GRID_ZOOM_THRESHOLD } from "./grid";
import type { GridCell } from "./grid";
import type { Sample, Carrier, NetworkType } from "./mockData";

export interface CoverageQuery {
  bbox: [number, number, number, number]; // [sw_lat, sw_lon, ne_lat, ne_lon]
  zoom: number;
  carriers: Carrier[];
  networkTypes: NetworkType[];
  levelMin: number;
  levelMax: number;
  isdn?: string; // partial MSISDN search (optional)
}

export type CoverageResponse =
  | { mode: "grid"; cells: GridCell[] }
  | { mode: "samples"; samples: Sample[] };

export async function fetchCoverage(q: CoverageQuery): Promise<CoverageResponse> {
  // ── Mock implementation ───────────────────────────────────────────────────
  // Filter by bbox + user filters
  const [swLat, swLon, neLat, neLon] = q.bbox;
  const filtered = mockSamples.filter(
    (s) =>
      s.lat >= swLat && s.lat <= neLat &&
      s.lon >= swLon && s.lon <= neLon &&
      q.carriers.includes(s.carrier) &&
      q.networkTypes.includes(s.network_type) &&
      s.cellular_level >= q.levelMin &&
      s.cellular_level <= q.levelMax &&
      (!q.isdn || s.isdn.includes(q.isdn))
  );

  if (q.zoom >= GRID_ZOOM_THRESHOLD) {
    return { mode: "samples", samples: filtered };
  }

  const resolution = zoomToH3Resolution(q.zoom);
  const cells = aggregateToH3(filtered, resolution);
  return { mode: "grid", cells };
  // ── End mock ──────────────────────────────────────────────────────────────
}
