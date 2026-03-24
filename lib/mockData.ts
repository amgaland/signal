export type NetworkType = "2G" | "3G" | "4G" | "5G";
export type Carrier = "Mobicom" | "Unitel" | "Skytel";

export interface Sample {
  ts: string;
  device_id_hash: string;
  lat: number;
  lon: number;
  app_version: string;
  network_type: NetworkType;
  carrier: Carrier;
  cellular_dbm: number;
  cellular_level: 1 | 2 | 3 | 4 | 5;
  wifi_dbm: number;
  wifi_level: 1 | 2 | 3 | 4;
  speed_kmh: number;
  consent_version: string;
  env: string;
}

const carriers: Carrier[] = ["Mobicom", "Unitel", "Skytel"];
const networkTypes: NetworkType[] = ["2G", "3G", "4G", "5G"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function dbmToLevel(dbm: number): 1 | 2 | 3 | 4 | 5 {
  if (dbm >= -65) return 5;
  if (dbm >= -75) return 4;
  if (dbm >= -85) return 3;
  if (dbm >= -95) return 2;
  return 1;
}

// Ulaanbaatar center: ~47.9°N, 106.9°E
// Spread samples across the city (~±0.15° lat/lon ≈ ~15km)
const BASE_LAT = 47.9;
const BASE_LON = 106.9;

const rawSamples: Omit<Sample, "cellular_level">[] = [
  // Dense city center (stronger signal)
  { ts: "2024-01-15T08:22:10Z", device_id_hash: "A1", lat: 47.9077, lon: 106.9036, app_version: "2.1.0", network_type: "5G", carrier: "Mobicom", cellular_dbm: -52, wifi_dbm: -42, wifi_level: 4, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-15T09:05:33Z", device_id_hash: "B2", lat: 47.9120, lon: 106.9180, app_version: "2.0.1", network_type: "4G", carrier: "Unitel", cellular_dbm: -68, wifi_dbm: -55, wifi_level: 3, speed_kmh: 15, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-15T10:11:45Z", device_id_hash: "C3", lat: 47.9050, lon: 106.8950, app_version: "1.9.5", network_type: "4G", carrier: "Skytel", cellular_dbm: -73, wifi_dbm: -60, wifi_level: 3, speed_kmh: 5, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-15T11:30:00Z", device_id_hash: "D4", lat: 47.9200, lon: 106.9300, app_version: "2.1.0", network_type: "5G", carrier: "Mobicom", cellular_dbm: -58, wifi_dbm: -48, wifi_level: 4, speed_kmh: 30, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-15T12:00:00Z", device_id_hash: "E5", lat: 47.9155, lon: 106.9055, app_version: "2.1.0", network_type: "4G", carrier: "Unitel", cellular_dbm: -61, wifi_dbm: -50, wifi_level: 4, speed_kmh: 10, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-16T08:45:22Z", device_id_hash: "F6", lat: 47.9090, lon: 106.9110, app_version: "2.0.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -70, wifi_dbm: -58, wifi_level: 3, speed_kmh: 20, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-16T09:15:05Z", device_id_hash: "G7", lat: 47.9003, lon: 106.9002, app_version: "2.1.0", network_type: "3G", carrier: "Skytel", cellular_dbm: -82, wifi_dbm: -70, wifi_level: 2, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-16T10:22:18Z", device_id_hash: "H8", lat: 47.9140, lon: 106.8880, app_version: "1.8.0", network_type: "4G", carrier: "Unitel", cellular_dbm: -75, wifi_dbm: -65, wifi_level: 3, speed_kmh: 45, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-16T11:00:00Z", device_id_hash: "I9", lat: 47.9250, lon: 106.8950, app_version: "2.1.0", network_type: "5G", carrier: "Mobicom", cellular_dbm: -55, wifi_dbm: -44, wifi_level: 4, speed_kmh: 60, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-16T14:30:00Z", device_id_hash: "J10", lat: 47.9030, lon: 106.9200, app_version: "2.0.1", network_type: "4G", carrier: "Skytel", cellular_dbm: -78, wifi_dbm: -66, wifi_level: 2, speed_kmh: 25, consent_version: "1.0", env: "prod" },

  // Northern suburbs (mixed signal)
  { ts: "2024-01-17T07:10:00Z", device_id_hash: "K11", lat: 47.9450, lon: 106.9050, app_version: "2.0.0", network_type: "3G", carrier: "Unitel", cellular_dbm: -88, wifi_dbm: -75, wifi_level: 2, speed_kmh: 40, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-17T08:00:00Z", device_id_hash: "L12", lat: 47.9500, lon: 106.9200, app_version: "1.9.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -80, wifi_dbm: -70, wifi_level: 2, speed_kmh: 55, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-17T09:45:11Z", device_id_hash: "M13", lat: 47.9380, lon: 106.8800, app_version: "2.1.0", network_type: "2G", carrier: "Skytel", cellular_dbm: -102, wifi_dbm: -88, wifi_level: 1, speed_kmh: 10, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-17T10:30:00Z", device_id_hash: "N14", lat: 47.9550, lon: 106.8950, app_version: "2.0.0", network_type: "3G", carrier: "Unitel", cellular_dbm: -92, wifi_dbm: -80, wifi_level: 1, speed_kmh: 70, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-17T12:00:00Z", device_id_hash: "O15", lat: 47.9420, lon: 106.9150, app_version: "2.1.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -76, wifi_dbm: -62, wifi_level: 3, speed_kmh: 35, consent_version: "1.0", env: "prod" },

  // Southern areas
  { ts: "2024-01-18T08:00:00Z", device_id_hash: "P16", lat: 47.8750, lon: 106.9100, app_version: "2.0.1", network_type: "4G", carrier: "Unitel", cellular_dbm: -71, wifi_dbm: -60, wifi_level: 3, speed_kmh: 20, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-18T09:00:00Z", device_id_hash: "Q17", lat: 47.8650, lon: 106.9050, app_version: "1.8.5", network_type: "3G", carrier: "Skytel", cellular_dbm: -89, wifi_dbm: -77, wifi_level: 2, speed_kmh: 50, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-18T10:15:30Z", device_id_hash: "R18", lat: 47.8800, lon: 106.8850, app_version: "2.1.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -66, wifi_dbm: -54, wifi_level: 3, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-18T11:30:00Z", device_id_hash: "S19", lat: 47.8700, lon: 106.8700, app_version: "2.0.0", network_type: "2G", carrier: "Unitel", cellular_dbm: -105, wifi_dbm: -90, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-18T14:00:00Z", device_id_hash: "T20", lat: 47.8900, lon: 106.9300, app_version: "2.1.0", network_type: "4G", carrier: "Skytel", cellular_dbm: -74, wifi_dbm: -63, wifi_level: 3, speed_kmh: 15, consent_version: "1.0", env: "prod" },

  // Eastern areas
  { ts: "2024-01-19T08:00:00Z", device_id_hash: "U21", lat: 47.9100, lon: 107.0000, app_version: "2.0.0", network_type: "3G", carrier: "Mobicom", cellular_dbm: -86, wifi_dbm: -74, wifi_level: 2, speed_kmh: 80, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-19T09:30:00Z", device_id_hash: "V22", lat: 47.9050, lon: 107.0200, app_version: "1.9.5", network_type: "2G", carrier: "Unitel", cellular_dbm: -108, wifi_dbm: -95, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-19T11:00:00Z", device_id_hash: "W23", lat: 47.9150, lon: 106.9800, app_version: "2.1.0", network_type: "4G", carrier: "Skytel", cellular_dbm: -72, wifi_dbm: -61, wifi_level: 3, speed_kmh: 60, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-19T13:00:00Z", device_id_hash: "X24", lat: 47.9200, lon: 106.9600, app_version: "2.0.1", network_type: "4G", carrier: "Mobicom", cellular_dbm: -63, wifi_dbm: -52, wifi_level: 4, speed_kmh: 25, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-19T15:00:00Z", device_id_hash: "Y25", lat: 47.9300, lon: 106.9700, app_version: "2.1.0", network_type: "5G", carrier: "Mobicom", cellular_dbm: -54, wifi_dbm: -44, wifi_level: 4, speed_kmh: 40, consent_version: "1.0", env: "prod" },

  // Western areas
  { ts: "2024-01-20T08:00:00Z", device_id_hash: "Z26", lat: 47.9100, lon: 106.8400, app_version: "1.8.0", network_type: "3G", carrier: "Skytel", cellular_dbm: -91, wifi_dbm: -78, wifi_level: 1, speed_kmh: 30, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-20T09:00:00Z", device_id_hash: "AA27", lat: 47.9050, lon: 106.8200, app_version: "2.0.0", network_type: "2G", carrier: "Unitel", cellular_dbm: -107, wifi_dbm: -93, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-20T10:30:00Z", device_id_hash: "AB28", lat: 47.9200, lon: 106.8500, app_version: "2.1.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -77, wifi_dbm: -65, wifi_level: 2, speed_kmh: 50, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-20T12:00:00Z", device_id_hash: "AC29", lat: 47.9000, lon: 106.8600, app_version: "2.0.1", network_type: "4G", carrier: "Skytel", cellular_dbm: -69, wifi_dbm: -57, wifi_level: 3, speed_kmh: 35, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-20T14:30:00Z", device_id_hash: "AD30", lat: 47.9150, lon: 106.8300, app_version: "1.9.0", network_type: "3G", carrier: "Unitel", cellular_dbm: -95, wifi_dbm: -82, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },

  // Scattered across city — various conditions
  { ts: "2024-01-21T07:30:00Z", device_id_hash: "AE31", lat: 47.8950, lon: 106.9450, app_version: "2.1.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -67, wifi_dbm: -56, wifi_level: 3, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-21T08:45:00Z", device_id_hash: "AF32", lat: 47.9350, lon: 106.9400, app_version: "2.0.0", network_type: "5G", carrier: "Unitel", cellular_dbm: -57, wifi_dbm: -47, wifi_level: 4, speed_kmh: 20, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-21T10:00:00Z", device_id_hash: "AG33", lat: 47.9280, lon: 106.8750, app_version: "2.1.0", network_type: "4G", carrier: "Skytel", cellular_dbm: -83, wifi_dbm: -71, wifi_level: 2, speed_kmh: 45, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-21T11:30:00Z", device_id_hash: "AH34", lat: 47.8820, lon: 106.9600, app_version: "2.0.1", network_type: "3G", carrier: "Mobicom", cellular_dbm: -90, wifi_dbm: -78, wifi_level: 1, speed_kmh: 70, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-21T13:00:00Z", device_id_hash: "AI35", lat: 47.9480, lon: 106.9500, app_version: "1.9.5", network_type: "4G", carrier: "Unitel", cellular_dbm: -79, wifi_dbm: -67, wifi_level: 2, speed_kmh: 55, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-22T08:00:00Z", device_id_hash: "AJ36", lat: 47.9050, lon: 106.9750, app_version: "2.1.0", network_type: "4G", carrier: "Skytel", cellular_dbm: -73, wifi_dbm: -62, wifi_level: 3, speed_kmh: 30, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-22T09:30:00Z", device_id_hash: "AK37", lat: 47.8770, lon: 106.8950, app_version: "2.0.0", network_type: "3G", carrier: "Mobicom", cellular_dbm: -87, wifi_dbm: -75, wifi_level: 2, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-22T11:00:00Z", device_id_hash: "AL38", lat: 47.9600, lon: 106.9100, app_version: "2.1.0", network_type: "2G", carrier: "Unitel", cellular_dbm: -103, wifi_dbm: -90, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-22T12:30:00Z", device_id_hash: "AM39", lat: 47.9070, lon: 106.9550, app_version: "2.0.1", network_type: "4G", carrier: "Skytel", cellular_dbm: -65, wifi_dbm: -54, wifi_level: 3, speed_kmh: 25, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-22T14:00:00Z", device_id_hash: "AN40", lat: 47.9330, lon: 106.9250, app_version: "2.1.0", network_type: "5G", carrier: "Mobicom", cellular_dbm: -51, wifi_dbm: -41, wifi_level: 4, speed_kmh: 10, consent_version: "1.0", env: "prod" },

  // More varied locations
  { ts: "2024-01-23T08:00:00Z", device_id_hash: "AO41", lat: 47.9180, lon: 106.9400, app_version: "1.8.5", network_type: "4G", carrier: "Unitel", cellular_dbm: -72, wifi_dbm: -61, wifi_level: 3, speed_kmh: 40, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-23T09:15:00Z", device_id_hash: "AP42", lat: 47.8880, lon: 106.8750, app_version: "2.0.0", network_type: "3G", carrier: "Skytel", cellular_dbm: -94, wifi_dbm: -82, wifi_level: 1, speed_kmh: 60, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-23T10:45:00Z", device_id_hash: "AQ43", lat: 47.9260, lon: 106.8650, app_version: "2.1.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -60, wifi_dbm: -50, wifi_level: 4, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-23T12:00:00Z", device_id_hash: "AR44", lat: 47.8960, lon: 107.0100, app_version: "2.0.1", network_type: "2G", carrier: "Unitel", cellular_dbm: -110, wifi_dbm: -95, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-23T13:30:00Z", device_id_hash: "AS45", lat: 47.9400, lon: 106.8900, app_version: "2.1.0", network_type: "4G", carrier: "Skytel", cellular_dbm: -77, wifi_dbm: -66, wifi_level: 2, speed_kmh: 35, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-24T08:00:00Z", device_id_hash: "AT46", lat: 47.9080, lon: 106.8480, app_version: "2.0.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -69, wifi_dbm: -58, wifi_level: 3, speed_kmh: 50, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-24T09:00:00Z", device_id_hash: "AU47", lat: 47.9340, lon: 106.9050, app_version: "2.1.0", network_type: "5G", carrier: "Unitel", cellular_dbm: -56, wifi_dbm: -46, wifi_level: 4, speed_kmh: 15, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-24T10:30:00Z", device_id_hash: "AV48", lat: 47.8830, lon: 106.9400, app_version: "1.9.0", network_type: "3G", carrier: "Skytel", cellular_dbm: -97, wifi_dbm: -84, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-24T12:00:00Z", device_id_hash: "AW49", lat: 47.9170, lon: 106.9650, app_version: "2.0.1", network_type: "4G", carrier: "Mobicom", cellular_dbm: -62, wifi_dbm: -51, wifi_level: 4, speed_kmh: 20, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-24T14:00:00Z", device_id_hash: "AX50", lat: 47.9490, lon: 106.9350, app_version: "2.1.0", network_type: "4G", carrier: "Unitel", cellular_dbm: -84, wifi_dbm: -72, wifi_level: 2, speed_kmh: 65, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-25T08:30:00Z", device_id_hash: "AY51", lat: 47.9010, lon: 106.8730, app_version: "2.0.0", network_type: "4G", carrier: "Skytel", cellular_dbm: -76, wifi_dbm: -64, wifi_level: 2, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-25T10:00:00Z", device_id_hash: "AZ52", lat: 47.9220, lon: 106.9550, app_version: "2.1.0", network_type: "5G", carrier: "Mobicom", cellular_dbm: -53, wifi_dbm: -43, wifi_level: 4, speed_kmh: 45, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-25T11:30:00Z", device_id_hash: "BA53", lat: 47.8680, lon: 106.9200, app_version: "2.0.1", network_type: "3G", carrier: "Unitel", cellular_dbm: -96, wifi_dbm: -83, wifi_level: 1, speed_kmh: 30, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-25T13:00:00Z", device_id_hash: "BB54", lat: 47.9530, lon: 106.8750, app_version: "2.1.0", network_type: "2G", carrier: "Skytel", cellular_dbm: -104, wifi_dbm: -91, wifi_level: 1, speed_kmh: 0, consent_version: "1.0", env: "prod" },
  { ts: "2024-01-25T15:00:00Z", device_id_hash: "BC55", lat: 47.9130, lon: 106.9020, app_version: "2.0.0", network_type: "4G", carrier: "Mobicom", cellular_dbm: -64, wifi_dbm: -53, wifi_level: 4, speed_kmh: 10, consent_version: "1.0", env: "prod" },
];

export const mockSamples: Sample[] = rawSamples.map((s) => ({
  ...s,
  cellular_level: dbmToLevel(s.cellular_dbm),
}));

export const ALL_CARRIERS = carriers;
export const ALL_NETWORK_TYPES = networkTypes;
