import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = "/run/portfolio-monitor/latest.json";

export async function GET() {
  try {
    // Read the latest server measurements
    const contents = await readFile(DATA_FILE, "utf8");

    const stats = JSON.parse(contents);

    // Check that monitoring data is valid and recent
    const timestamp = Date.parse(stats.timestamp);

    if (
      !Number.isFinite(timestamp) ||
      Date.now() - timestamp > 90000 ||
      timestamp > Date.now() + 30000
    ) {
      throw new Error("Monitoring data is stale");
    }

    // Return measurements without caching
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Monitoring data unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
