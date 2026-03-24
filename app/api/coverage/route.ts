import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://z-osa.mobicom.mn/signal/api/coverage";

export async function GET(request: NextRequest) {
  const rawQuery = request.url.split("?")[1] ?? "";
  const url = rawQuery ? `${BACKEND}?${rawQuery}` : BACKEND;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[coverage proxy] backend error", res.status, text);
      return NextResponse.json(
        { error: `Backend ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[coverage proxy] fetch failed", err?.message);
    return NextResponse.json(
      { error: "Proxy fetch failed", detail: err?.message },
      { status: 502 }
    );
  }
}
