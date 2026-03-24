"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Carrier, NetworkType } from "@/lib/mockData";

export interface Filters {
  carriers: Carrier[];
  networkTypes: NetworkType[];
  levelRange: [number, number];
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  colorMode: "signal" | "network";
  onColorModeChange: (m: "signal" | "network") => void;
  totalFiltered: number;
}

const ALL_CARRIERS: Carrier[] = ["Mobicom", "Unitel", "Skytel"];
const ALL_NETWORK_TYPES: NetworkType[] = ["2G", "3G", "4G", "5G"];

const CARRIER_COLORS: Record<Carrier, string> = {
  Mobicom: "bg-blue-500",
  Unitel: "bg-emerald-500",
  Skytel: "bg-violet-500",
};

const NETWORK_COLORS: Record<NetworkType, string> = {
  "5G": "bg-blue-600",
  "4G": "bg-green-600",
  "3G": "bg-yellow-600",
  "2G": "bg-red-700",
};

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export default function FilterPanel({
  filters,
  onChange,
  colorMode,
  onColorModeChange,
  totalFiltered,
}: FilterPanelProps) {
  const reset = () =>
    onChange({
      carriers: [...ALL_CARRIERS],
      networkTypes: [...ALL_NETWORK_TYPES],
      levelRange: [1, 5],
    });

  return (
    <div className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-700 overflow-y-auto flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-sm">Filters</span>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-400">
        Showing <span className="text-white font-semibold">{totalFiltered}</span> samples
      </p>

      {/* Color mode toggle */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm text-white">Color Mode</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex rounded-md overflow-hidden border border-slate-600">
            <button
              className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                colorMode === "signal"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }`}
              onClick={() => onColorModeChange("signal")}
            >
              Signal Level
            </button>
            <button
              className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                colorMode === "network"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }`}
              onClick={() => onColorModeChange("network")}
            >
              Network Type
            </button>
          </div>

          {/* Legend */}
          <div className="mt-3 space-y-1">
            {colorMode === "signal" ? (
              <>
                {([5, 4, 3, 2, 1] as const).map((lvl) => {
                  const colors = {
                    5: "bg-green-500",
                    4: "bg-lime-500",
                    3: "bg-yellow-500",
                    2: "bg-orange-500",
                    1: "bg-red-500",
                  };
                  const labels = {
                    5: "Excellent (≥ −65 dBm)",
                    4: "Good (−75 to −65)",
                    3: "Fair (−85 to −75)",
                    2: "Poor (−95 to −85)",
                    1: "Very Poor (< −95)",
                  };
                  return (
                    <div key={lvl} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[lvl]}`} />
                      <span className="text-xs text-slate-300">{labels[lvl]}</span>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {(["5G", "4G", "3G", "2G"] as const).map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${NETWORK_COLORS[t]}`} />
                    <span className="text-xs text-slate-300">{t}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Carrier filter */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm text-white">Carrier</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
          {ALL_CARRIERS.map((carrier) => {
            const active = filters.carriers.includes(carrier);
            return (
              <button
                key={carrier}
                onClick={() =>
                  onChange({ ...filters, carriers: toggle(filters.carriers, carrier) })
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? `${CARRIER_COLORS[carrier]} text-white border-transparent`
                    : "bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-400"
                }`}
              >
                {carrier}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Network type filter */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm text-white">Network Type</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
          {ALL_NETWORK_TYPES.map((type) => {
            const active = filters.networkTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() =>
                  onChange({
                    ...filters,
                    networkTypes: toggle(filters.networkTypes, type),
                  })
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? `${NETWORK_COLORS[type]} text-white border-transparent`
                    : "bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-400"
                }`}
              >
                {type}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Signal level range */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-white">Signal Level</CardTitle>
            <span className="text-xs text-slate-400">
              {filters.levelRange[0]} – {filters.levelRange[1]}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-6">
          <Slider
            min={1}
            max={5}
            step={1}
            value={filters.levelRange}
            onValueChange={(v) =>
              onChange({ ...filters, levelRange: [v[0], v[1]] as [number, number] })
            }
            className="mt-2"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">Weak (1)</span>
            <span className="text-xs text-slate-500">Strong (5)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
