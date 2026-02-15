import { NextResponse } from "next/server";
import { generateMRRData, generateARRData } from "@/lib/mock-data";

export async function GET() {
  const mrrHistory = generateMRRData();
  const arrHistory = generateARRData();

  return NextResponse.json({
    mrr: {
      current: 0,
      history: mrrHistory,
    },
    arr: {
      current: 0,
      history: arrHistory,
    },
  });
}
