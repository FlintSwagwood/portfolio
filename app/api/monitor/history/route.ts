
import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HISTORY_FILE =
  "/run/portfolio-monitor/history.json";

export async function GET() {
  try {
    const contents = await readFile(
      HISTORY_FILE,
      "utf8"
    );

    const history: unknown = JSON.parse(contents);

    if (!Array.isArray(history)) {
      throw new Error("Invalid history format");
    }

    // Return only the information needed for graphs
    const samples = history.slice(-240).map((item) => {
      const timestamp = item?.timestamp;
      const cpu = item?.cpu_percent;
      const memory = item?.memory_percent;
      const disk = item?.disk_percent;

      if (
        typeof timestamp !== "string" ||
        !Number.isFinite(Date.parse(timestamp)) ||
        ![cpu, memory, disk].every(
          (value) =>
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        )
      ) {
        throw new Error("Invalid monitoring sample");
      }

      return {
        timestamp,
        cpu_percent: cpu,
        memory_percent: memory,
        disk_percent: disk,
      };
    });

    return NextResponse.json(
      { samples },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Historical data unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

