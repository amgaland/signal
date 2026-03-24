"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { mockSamples, ALL_CARRIERS, ALL_NETWORK_TYPES } from "@/lib/mockData";
import FilterPanel, { type Filters } from "@/components/FilterPanel";
import StatsBar from "@/components/StatsBar";
import { useLanguage } from "@/lib/LanguageContext";
import type { Locale } from "@/lib/i18n";

const CoverageMap = dynamic(() => import("@/components/CoverageMap"), {
  ssr: false,
  loading: () => <MapLoading />,
});

function MapLoading() {
  const { t } = useLanguage();
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-slate-400 text-sm animate-pulse">{t.map.loading}</div>
    </div>
  );
}

export default function Home() {
  const { setLocale, locale } = useLanguage();
  const [filters, setFilters] = useState<Filters>({
    carriers: [...ALL_CARRIERS],
    networkTypes: [...ALL_NETWORK_TYPES],
    levelRange: [1, 5],
    isdn: "",
  });
  const [colorMode, setColorMode] = useState<"signal" | "network">("signal");

  // Stats bar still needs a filtered count — compute from all samples (not bbox-restricted)
  const filteredForStats = useMemo(
    () =>
      mockSamples.filter(
        (s) =>
          filters.carriers.includes(s.carrier) &&
          filters.networkTypes.includes(s.network_type) &&
          s.cellular_level >= filters.levelRange[0] &&
          s.cellular_level <= filters.levelRange[1] &&
          (!filters.isdn || s.isdn.includes(filters.isdn))
      ),
    [filters]
  );

  return (
    <main className="flex flex-col h-screen bg-slate-900">
      <StatsBar
        samples={filteredForStats}
        locale={locale}
        onLocaleChange={(l: Locale) => setLocale(l)}
      />
      <div className="flex flex-1 overflow-hidden">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          totalFiltered={filteredForStats.length}
        />
        <div className="flex-1 relative">
          <CoverageMap
            carriers={filters.carriers}
            networkTypes={filters.networkTypes}
            levelRange={filters.levelRange}
            colorMode={colorMode}
            isdn={filters.isdn}
          />
        </div>
      </div>
    </main>
  );
}
