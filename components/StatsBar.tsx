"use client";

import { useMemo } from "react";
import { Signal, Wifi, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Sample, Carrier } from "@/lib/mockData";

interface StatsBarProps {
  samples: Sample[];
}

export default function StatsBar({ samples }: StatsBarProps) {
  const stats = useMemo(() => {
    if (samples.length === 0) {
      return { total: 0, avgDbm: 0, strongestCarrier: "—", avgLevel: 0 };
    }

    const total = samples.length;
    const avgDbm = Math.round(
      samples.reduce((sum, s) => sum + s.cellular_dbm, 0) / total
    );
    const avgLevel = (
      samples.reduce((sum, s) => sum + s.cellular_level, 0) / total
    ).toFixed(1);

    // Carrier with best avg signal
    const carrierGroups: Record<string, number[]> = {};
    samples.forEach((s) => {
      if (!carrierGroups[s.carrier]) carrierGroups[s.carrier] = [];
      carrierGroups[s.carrier].push(s.cellular_dbm);
    });
    const carrierAvg = Object.entries(carrierGroups).map(([c, dbms]) => ({
      carrier: c,
      avg: dbms.reduce((a, b) => a + b, 0) / dbms.length,
    }));
    const strongestCarrier =
      carrierAvg.sort((a, b) => b.avg - a.avg)[0]?.carrier ?? "—";

    return { total, avgDbm, strongestCarrier, avgLevel };
  }, [samples]);

  const levelColor = (level: number) => {
    if (level >= 4.5) return "bg-green-500";
    if (level >= 3.5) return "bg-lime-500";
    if (level >= 2.5) return "bg-yellow-500";
    if (level >= 1.5) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-slate-900 border-b border-slate-700">
      {/* Title */}
      <div className="flex items-center gap-2 mr-4">
        <Signal className="w-5 h-5 text-blue-400" />
        <span className="text-white font-semibold text-sm tracking-wide">
          UB Coverage Map
        </span>
      </div>

      {/* Total samples */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <Users className="w-4 h-4 text-blue-400" />
        <div>
          <p className="text-xs text-slate-400 leading-none">Samples</p>
          <p className="text-sm font-bold leading-tight">{stats.total}</p>
        </div>
      </Card>

      {/* Avg signal */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <Wifi className="w-4 h-4 text-purple-400" />
        <div>
          <p className="text-xs text-slate-400 leading-none">Avg Signal</p>
          <p className="text-sm font-bold leading-tight">{stats.avgDbm} dBm</p>
        </div>
      </Card>

      {/* Avg level */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <div
          className={`w-3 h-3 rounded-full ${levelColor(Number(stats.avgLevel))}`}
        />
        <div>
          <p className="text-xs text-slate-400 leading-none">Avg Level</p>
          <p className="text-sm font-bold leading-tight">{stats.avgLevel} / 5</p>
        </div>
      </Card>

      {/* Strongest carrier */}
      <Card className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-slate-600 text-white">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <div>
          <p className="text-xs text-slate-400 leading-none">Best Carrier</p>
          <p className="text-sm font-bold leading-tight">{stats.strongestCarrier}</p>
        </div>
      </Card>

      {/* Network type breakdown */}
      <div className="flex items-center gap-2 ml-auto">
        {(["5G", "4G", "3G", "2G"] as const).map((type) => {
          const count = samples.filter((s) => s.network_type === type).length;
          if (count === 0) return null;
          const colors: Record<string, string> = {
            "5G": "bg-blue-600",
            "4G": "bg-green-600",
            "3G": "bg-yellow-600",
            "2G": "bg-red-700",
          };
          return (
            <Badge
              key={type}
              className={`${colors[type]} text-white border-0 text-xs`}
            >
              {type}: {count}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
