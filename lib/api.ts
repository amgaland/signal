/**
 * API layer — connected to the real backend.
 * Base URL is read from NEXT_PUBLIC_API_BASE_URL (defaults to localhost:8080).
 */

import type { GridCell } from "./grid";
import type { Sample, Carrier, NetworkType } from "./mockData";

const COVERAGE_URL =
  process.env.NEXT_PUBLIC_COVERAGE_URL ?? "https://z-osa.mobicom.mn/signal/api/coverage";

export interface CoverageQuery {
  bbox: [number, number, number, number]; // [sw_lat, sw_lon, ne_lat, ne_lon]
  zoom: number;
  carriers: Carrier[];
  networkTypes: NetworkType[];
  levelMin: number;
  levelMax: number;
  isdn?: string;
}

export type CoverageResponse =
  | { mode: "grid"; cells: GridCell[] }
  | { mode: "samples"; samples: Sample[] };

export async function fetchCoverage(q: CoverageQuery): Promise<CoverageResponse> {
  // Build query string manually — URLSearchParams encodes commas as %2C
  // but this backend expects literal commas (e.g. bbox=47.85,106.82,47.97,107.02)
  const parts: string[] = [
    `bbox=${q.bbox.join(",")}`,
    `zoom=${q.zoom}`,
    `level_min=${q.levelMin}`,
    `level_max=${q.levelMax}`,
  ];
  if (q.carriers.length)     parts.push(`carrier=${q.carriers.join(",")}`);
  if (q.networkTypes.length) parts.push(`network_type=${q.networkTypes.join(",")}`);
  if (q.isdn)                parts.push(`isdn=${encodeURIComponent(q.isdn)}`);

  const url = `${COVERAGE_URL}?${parts.join("&")}`;
  console.log("[coverage] GET", url);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[coverage] error", res.status, body);
    // Return empty result so the map doesn't crash
    return { mode: "grid", cells: [] };
  }

  const data = await res.json();

  if (data.mode === "grid") {
    const cells: GridCell[] = (data.cells ?? []).map((c: any) => ({
      cellId:           c.cell_id,
      lat:              c.lat,
      lon:              c.lon,
      avgDbm:           c.avg_dbm,
      avgLevel:         c.avg_level,
      sampleCount:      c.sample_count,
      dominantCarrier:  c.dominant_carrier,
      dominantNetwork:  c.dominant_network,
      latestTs:         c.latest_ts,
      oldestTs:         c.oldest_ts,
    }));
    return { mode: "grid", cells };
  } else {
    const samples: Sample[] = (data.samples ?? []).map((s: any) => ({
      ts:              s.ts,
      device_id_hash:  s.device_id_hash,
      isdn:            s.isdn ?? "",
      lat:             s.lat,
      lon:             s.lon,
      app_version:     s.app_version ?? "",
      network_type:    s.network_type,
      carrier:         s.carrier,
      cellular_dbm:    s.cellular_dbm,
      cellular_level:  s.cellular_level,
      wifi_dbm:        s.wifi_dbm,
      wifi_level:      s.wifi_level,
      speed_kmh:       s.speed_kmh,
      consent_version: s.consent_version ?? "",
      env:             s.env ?? "",
    }));
    return { mode: "samples", samples };
  }
}
