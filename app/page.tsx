"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { mockSamples, ALL_CARRIERS, ALL_NETWORK_TYPES } from "@/lib/mockData";
import FilterPanel, { type Filters } from "@/components/FilterPanel";
import StatsBar from "@/components/StatsBar";

// Load map only on client (Leaflet requires window)
const CoverageMap = dynamic(() => import("@/components/CoverageMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-slate-400 text-sm animate-pulse">Loading map…</div>
    </div>
  ),
});

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    carriers: [...ALL_CARRIERS],
    networkTypes: [...ALL_NETWORK_TYPES],
    levelRange: [1, 5],
  });
  const [colorMode, setColorMode] = useState<"signal" | "network">("signal");

  const filtered = useMemo(() => {
    return mockSamples.filter(
      (s) =>
        filters.carriers.includes(s.carrier) &&
        filters.networkTypes.includes(s.network_type) &&
        s.cellular_level >= filters.levelRange[0] &&
        s.cellular_level <= filters.levelRange[1]
    );
  }, [filters]);

  return (
    <main className="flex flex-col h-screen bg-slate-900">
      {/* Top stats bar */}
      <StatsBar samples={filtered} />

      {/* Body: sidebar + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter sidebar */}
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          totalFiltered={filtered.length}
        />

        {/* Map */}
        <div className="flex-1 relative">
          <CoverageMap samples={filtered} colorMode={colorMode} />
        </div>
      </div>
    </main>
  );
}
