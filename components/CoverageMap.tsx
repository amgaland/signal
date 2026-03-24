"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { fetchCoverage, type CoverageQuery, type CoverageResponse } from "@/lib/api";
import { GRID_ZOOM_THRESHOLD, levelFromAvg } from "@/lib/grid";
import type { GridCell } from "@/lib/grid";
import type { Sample, Carrier, NetworkType } from "@/lib/mockData";

interface CoverageMapProps {
  carriers: Carrier[];
  networkTypes: NetworkType[];
  levelRange: [number, number];
  colorMode: "signal" | "network";
  isdn: string;
}

// ── Color maps ────────────────────────────────────────────────────────────────
const SIGNAL_COLORS: Record<number, string> = {
  5: "#22c55e",
  4: "#84cc16",
  3: "#eab308",
  2: "#f97316",
  1: "#ef4444",
};
const NETWORK_COLORS: Record<string, string> = {
  "5G": "#3b82f6",
  "4G": "#22c55e",
  "3G": "#eab308",
  "2G": "#ef4444",
};

function signalColor(level: number) { return SIGNAL_COLORS[level] ?? "#94a3b8"; }
function networkColor(type: string)  { return NETWORK_COLORS[type]  ?? "#94a3b8"; }

function formatTs(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function SignalBars({ level, color }: { level: number; color: string }) {
  const heights = [4, 7, 10, 13, 16];
  return (
    <svg width="28" height="18" viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 6}
          y={18 - h}
          width={4}
          height={h}
          rx={1}
          fill={i < level ? color : "#475569"}
        />
      ))}
    </svg>
  );
}

// ── Selected item — either a grid cell or individual sample ──────────────────
type Selected =
  | { kind: "cell";   cell: GridCell }
  | { kind: "sample"; sample: Sample };

// ── Component ────────────────────────────────────────────────────────────────
export default function CoverageMap({
  carriers, networkTypes, levelRange, colorMode, isdn,
}: CoverageMapProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const layerRef     = useRef<any[]>([]); // current rendered layers (markers or polygons)

  const [mapReady, setMapReady] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  // ── Init map (once) ─────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      if (!containerRef.current) return;
      if ((containerRef.current as any)._leaflet_id) return;

      const map = L.map(containerRef.current, {
        center: [47.9077, 106.9036],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
            ' &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      map.on("zoomend", () => setZoom(map.getZoom()));
      map.on("click",   () => { setSelected(null); setPopoverPos(null); });

      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // ── Re-render layers whenever any relevant prop or zoom changes ──────────
  const renderLayers = useCallback(async () => {
    if (!mapReady || !mapRef.current) return;

    const map = mapRef.current;
    const bounds = map.getBounds();
    const query: CoverageQuery = {
      bbox: [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()],
      zoom: map.getZoom(),
      carriers,
      networkTypes,
      levelMin: levelRange[0],
      levelMax: levelRange[1],
      isdn: isdn || undefined,
    };

    const response: CoverageResponse = await fetchCoverage(query);

    import("leaflet").then((L) => {
      // clear previous layers
      layerRef.current.forEach((l) => l.remove());
      layerRef.current = [];

      if (response.mode === "grid") {
        // ── Circles (one per aggregated cell) ─────────────────────────────
        // Radius matches approximate H3 cell size at each zoom level
        const radiusMap: Record<number, number> = { 5: 40000, 6: 15000, 7: 5500, 8: 2000, 9: 750 };
        const zoom = map.getZoom();
        const res  = zoom <= 9 ? 5 : zoom <= 10 ? 6 : zoom <= 11 ? 7 : zoom <= 12 ? 8 : 9;
        const radius = radiusMap[res] ?? 2000;

        for (const cell of response.cells) {
          const level = levelFromAvg(cell.avgLevel);
          const color =
            colorMode === "signal"
              ? signalColor(level)
              : networkColor(cell.dominantNetwork);

          const circle = L.circle([cell.lat, cell.lon], {
            radius,
            color,
            fillColor: color,
            fillOpacity: 0.55,
            weight: 1,
            opacity: 0.8,
          }).addTo(map);

          circle.on("click", (e: any) => {
            const pt = map.latLngToContainerPoint([cell.lat, cell.lon]);
            setPopoverPos({ x: pt.x, y: pt.y });
            setSelected({ kind: "cell", cell });
            L.DomEvent.stopPropagation(e);
          });

          layerRef.current.push(circle);
        }
      } else {
        // ── Individual dots ────────────────────────────────────────────────
        for (const sample of response.samples) {
          const color =
            colorMode === "signal"
              ? signalColor(sample.cellular_level)
              : networkColor(sample.network_type);

          const icon = L.divIcon({
            className: "",
            html: `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="6" fill="${color}" fill-opacity="0.9" stroke="white" stroke-width="1.5"/>
            </svg>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });

          const marker = L.marker([sample.lat, sample.lon], { icon }).addTo(map);

          marker.on("click", (e: any) => {
            const pt = map.latLngToContainerPoint([sample.lat, sample.lon]);
            setPopoverPos({ x: pt.x, y: pt.y });
            setSelected({ kind: "sample", sample });
            L.DomEvent.stopPropagation(e);
          });

          layerRef.current.push(marker);
        }
      }
    });
  }, [mapReady, carriers, networkTypes, levelRange, colorMode, zoom, isdn]); // zoom triggers H3 res change

  useEffect(() => { renderLayers(); }, [renderLayers]);

  // ── Popover color helper ─────────────────────────────────────────────────
  function selectedColor() {
    if (!selected) return "#94a3b8";
    if (selected.kind === "cell") {
      const lvl = levelFromAvg(selected.cell.avgLevel);
      return colorMode === "signal" ? signalColor(lvl) : networkColor(selected.cell.dominantNetwork);
    }
    return colorMode === "signal"
      ? signalColor(selected.sample.cellular_level)
      : networkColor(selected.sample.network_type);
  }

  return (
    <div className="relative w-full h-full">
      <style>{`
        @import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
        .leaflet-container { background: #1e293b; }
      `}</style>

      <div ref={containerRef} className="w-full h-full" />

      {/* Zoom mode indicator */}
      <div className="absolute bottom-6 left-4 z-[900] bg-slate-800/80 backdrop-blur-sm text-xs text-slate-300 px-2 py-1 rounded border border-slate-600">
        {zoom < GRID_ZOOM_THRESHOLD
          ? `H3 grid · zoom ${zoom}`
          : `Dots · zoom ${zoom}`}
      </div>

      {/* Popover */}
      {selected && popoverPos && (
        <div
          className="absolute z-[1000] w-64 max-h-[85vh] overflow-y-auto bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-4 text-white"
          style={{
            left: Math.min(popoverPos.x + 12, window.innerWidth - 280),
            top:  Math.min(Math.max(popoverPos.y - 100, 8), window.innerHeight - 320),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedColor() }} />
              <span className="font-semibold text-sm">
                {selected.kind === "cell"
                  ? selected.cell.dominantCarrier
                  : selected.sample.carrier}
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 font-medium">
              {selected.kind === "cell"
                ? selected.cell.dominantNetwork
                : selected.sample.network_type}
            </span>
          </div>

          {/* Signal bars + quality label */}
          {(() => {
            const lvl = selected.kind === "cell"
              ? levelFromAvg(selected.cell.avgLevel)
              : selected.sample.cellular_level;
            return (
              <div className="flex items-center gap-3 mb-3 p-2 bg-slate-700/50 rounded-md">
                <SignalBars level={lvl} color={selectedColor()} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: selectedColor() }}>
                    {t.popover.quality[lvl as 1|2|3|4|5]}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selected.kind === "cell"
                      ? `${selected.cell.avgDbm} dBm (avg)`
                      : `${selected.sample.cellular_dbm} dBm`}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Body */}
          <div className="space-y-1.5 text-xs">
            {selected.kind === "cell" ? (
              <>
                <Row label={t.popover.samples}  value={`${selected.cell.sampleCount}`} />
                <Row label={t.popover.wifi}     value="—" />
                {selected.cell.latestTs && selected.cell.oldestTs && (
                  <div className="pt-1 border-t border-slate-600 space-y-1">
                    <Row label={t.popover.period}
                      value={`${formatDate(selected.cell.oldestTs)} → ${formatDate(selected.cell.latestTs)}`} />
                  </div>
                )}
              </>
            ) : (
              <>
                <Row label={t.popover.isdn}   value={selected.sample.isdn} />
                <Row label={t.popover.wifi}   value={`${selected.sample.wifi_dbm} dBm`} />
                <Row label={t.popover.speed}  value={`${selected.sample.speed_kmh} km/h`} />
                <Row label={t.popover.app}    value={selected.sample.app_version} />
                <div className="pt-1 border-t border-slate-600">
                  <Row label={t.popover.collected} value={formatTs(selected.sample.ts)} />
                </div>
              </>
            )}
          </div>

          <button
            className="absolute top-2 right-2 text-slate-400 hover:text-white text-lg leading-none"
            onClick={() => { setSelected(null); setPopoverPos(null); }}
          >×</button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`text-slate-200 ${valueClass}`}>{value}</span>
    </div>
  );
}
