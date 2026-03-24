"use client";

import { Signal, Wifi, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/LanguageContext";
import type { MapStats } from "@/components/CoverageMap";
import type { Locale } from "@/lib/i18n";

interface StatsBarProps {
  stats: MapStats | null;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}

const levelColor = (level: number) => {
  if (level >= 4.5) return "bg-green-500";
  if (level >= 3.5) return "bg-lime-500";
  if (level >= 2.5) return "bg-yellow-500";
  if (level >= 1.5) return "bg-orange-500";
  return "bg-red-500";
};

export default function StatsBar({ stats, locale, onLocaleChange }: StatsBarProps) {
  const { t } = useLanguage();

  const total          = stats?.total ?? "—";
  const avgDbm         = stats ? `${stats.avgDbm} dBm` : "—";
  const avgLevelStr    = stats ? (stats.avgLevel).toFixed(1) : "—";
  const avgLevelNum    = stats?.avgLevel ?? 0;
  const bestCarrier    = stats?.strongestCarrier ?? "—";
  const networkCounts  = stats?.networkCounts ?? {};

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-slate-900 border-b border-slate-700">
      {/* Title */}
      <div className="flex items-center gap-2 mr-4">
        <Signal className="w-5 h-5 text-blue-400" />
        <span className="text-white font-semibold text-sm tracking-wide">
          {t.appTitle}
        </span>
      </div>

      {/* Total samples */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <Users className="w-4 h-4 text-blue-400" />
        <div>
          <p className="text-xs text-slate-400 leading-none">{t.statsBar.samples}</p>
          <p className="text-sm font-bold leading-tight">{total}</p>
        </div>
      </Card>

      {/* Avg signal */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <Wifi className="w-4 h-4 text-purple-400" />
        <div>
          <p className="text-xs text-slate-400 leading-none">{t.statsBar.avgSignal}</p>
          <p className="text-sm font-bold leading-tight">{avgDbm}</p>
        </div>
      </Card>

      {/* Avg level */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <div className={`w-3 h-3 rounded-full ${levelColor(avgLevelNum)}`} />
        <div>
          <p className="text-xs text-slate-400 leading-none">{t.statsBar.avgLevel}</p>
          <p className="text-sm font-bold leading-tight">{avgLevelStr} / 5</p>
        </div>
      </Card>

      {/* Strongest carrier */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <div>
          <p className="text-xs text-slate-400 leading-none">{t.statsBar.bestCarrier}</p>
          <p className="text-sm font-bold leading-tight">{bestCarrier}</p>
        </div>
      </Card>

      {/* Network type badges */}
      <div className="flex items-center gap-2">
        {(["5G", "4G", "3G", "2G"] as const).map((type) => {
          const count = networkCounts[type] ?? 0;
          if (count === 0) return null;
          const colors: Record<string, string> = {
            "5G": "bg-blue-600", "4G": "bg-green-600",
            "3G": "bg-yellow-600", "2G": "bg-red-700",
          };
          return (
            <Badge key={type} className={`${colors[type]} text-white border-0 text-xs`}>
              {type}: {count}
            </Badge>
          );
        })}
      </div>

      {/* Language toggle */}
      <div className="ml-auto flex items-center">
        <div className="flex rounded-md overflow-hidden border border-slate-600">
          {(["en", "mn"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => onLocaleChange(l)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                locale === l
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white"
              }`}
            >
              {l === "en" ? "🇬🇧 EN" : "🇲🇳 MN"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
