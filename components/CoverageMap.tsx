"use client";

import { useEffect, useRef, useState } from "react";
import type { Sample } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";

interface CoverageMapProps {
  samples: Sample[];
  colorMode: "signal" | "network";
}

const SIGNAL_COLORS: Record<number, string> = {
  5: "#22c55e", // green-500
  4: "#84cc16", // lime-500
  3: "#eab308", // yellow-500
  2: "#f97316", // orange-500
  1: "#ef4444", // red-500
};

const NETWORK_COLORS: Record<string, string> = {
  "5G": "#3b82f6", // blue-500
  "4G": "#22c55e", // green-500
  "3G": "#eab308", // yellow-500
  "2G": "#ef4444", // red-500
};

function formatTs(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CoverageMap({ samples, colorMode }: CoverageMapProps) {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon paths for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapContainerRef.current) return;

      // Guard against StrictMode double-invoke leaving a stale _leaflet_id on the DOM node
      if ((mapContainerRef.current as any)._leaflet_id) return;

      const map = L.map(mapContainerRef.current, {
        center: [47.9077, 106.9036],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;
      // Signal that the map is ready so the markers effect re-runs
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

  // Update markers when samples or colorMode change (or once the map first becomes ready)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    import("leaflet").then((L) => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      samples.forEach((sample) => {
        const color =
          colorMode === "signal"
            ? SIGNAL_COLORS[sample.cellular_level]
            : NETWORK_COLORS[sample.network_type];

        const svgIcon = L.divIcon({
          className: "",
          html: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" fill="${color}" fill-opacity="0.85" stroke="white" stroke-width="1.5"/>
          </svg>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([sample.lat, sample.lon], { icon: svgIcon }).addTo(
          mapRef.current
        );

        marker.on("click", (e: any) => {
          const containerPoint = mapRef.current.latLngToContainerPoint([
            sample.lat,
            sample.lon,
          ]);
          setPopoverPos({
            x: containerPoint.x,
            y: containerPoint.y,
          });
          setSelectedSample(sample);
          L.DomEvent.stopPropagation(e);
        });

        markersRef.current.push(marker);
      });

      // Close popover when clicking map
      mapRef.current.on("click", () => {
        setSelectedSample(null);
        setPopoverPos(null);
      });
    });
  }, [samples, colorMode, mapReady]);

  return (
    <div className="relative w-full h-full">
      {/* Leaflet CSS */}
      <style>{`
        @import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
        .leaflet-container { background: #1e293b; }
      `}</style>

      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Popover */}
      {selectedSample && popoverPos && (
        <div
          className="absolute z-[1000] w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-4 text-white"
          style={{
            left: Math.min(popoverPos.x + 12, window.innerWidth - 280),
            top: Math.max(popoverPos.y - 100, 8),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    colorMode === "signal"
                      ? SIGNAL_COLORS[selectedSample.cellular_level]
                      : NETWORK_COLORS[selectedSample.network_type],
                }}
              />
              <span className="font-semibold text-sm">{selectedSample.carrier}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 font-medium">
              {selectedSample.network_type}
            </span>
          </div>

          {/* Data rows */}
          <div className="space-y-1.5 text-xs">
            <Row label={t.popover.signal} value={`${selectedSample.cellular_dbm} dBm`} />
            <Row
              label={t.popover.level}
              value={`${selectedSample.cellular_level} / 5`}
              valueClass="font-bold"
            />
            <Row label={t.popover.wifi} value={`${selectedSample.wifi_dbm} dBm`} />
            <Row label={t.popover.speed} value={`${selectedSample.speed_kmh} km/h`} />
            <Row label={t.popover.app} value={selectedSample.app_version} />
            <div className="pt-1 border-t border-slate-600">
              <p className="text-slate-400">{formatTs(selectedSample.ts)}</p>
            </div>
          </div>

          {/* Close button */}
          <button
            className="absolute top-2 right-2 text-slate-400 hover:text-white text-lg leading-none"
            onClick={() => {
              setSelectedSample(null);
              setPopoverPos(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`text-slate-200 ${valueClass}`}>{value}</span>
    </div>
  );
}
