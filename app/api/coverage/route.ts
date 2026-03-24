import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://z-osa.mobicom.mn/signal/api/coverage";

export async function GET(request: NextRequest) {
  // Forward the raw query string as-is to preserve literal commas
  const rawQuery = request.url.split("?")[1] ?? "";
  const url = rawQuery ? `${BACKEND}?${rawQuery}` : BACKEND;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
