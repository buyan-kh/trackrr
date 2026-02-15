import { NextResponse } from "next/server";
import { generatePolymarketData } from "@/lib/mock-data";

export async function GET() {
  const history = generatePolymarketData();
  const current = history[history.length - 1]?.value ?? 0;

  return NextResponse.json({
    portfolio: {
      current,
      history,
    },
  });
}
