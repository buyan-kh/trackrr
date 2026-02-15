import { NextResponse } from "next/server";
import { generateMRRData, generateARRData, getCurrentMRR, getCurrentARR } from "@/lib/mock-data";

export async function GET() {
  const mrrHistory = generateMRRData();
  const arrHistory = generateARRData();

  return NextResponse.json({
    mrr: {
      current: getCurrentMRR(),
      history: mrrHistory,
    },
    arr: {
      current: getCurrentARR(),
      history: arrHistory,
    },
  });
}
