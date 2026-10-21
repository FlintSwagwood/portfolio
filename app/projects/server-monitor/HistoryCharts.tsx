
"use client";

import { useEffect, useState } from "react";

type Sample = {
  timestamp: string;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
};

type Metric = "cpu_percent" | "memory_percent" | "disk_percent";

function PerformanceGraph({
  title,
  samples,
  metric,
  color,
}: {
  title: string;
  samples: Sample[];
  metric: Metric;
  color: string;
}) {
  const values = samples.map((s) => s[metric]);
  const maximum = Math.min(
    100,
    Math.max(1, Math.ceil(Math.max(...values) * 1.2))
  );

  const points = values.map((value, index) => {
    const x = 12 + (index / Math.max(1, values.length - 1)) * 576;
    const y = 145 - (value / maximum) * 125;
    return `${x},${y}`;
  }).join(" ");

  const latest = values[values.length - 1];
  const firstTime = new Date(samples[0].timestamp);
  const lastTime = new Date(samples[samples.length - 1].timestamp);

  return (
    <div
      style={{
        background: "#151e31",
        border: "1px solid #29354a",
        borderRadius: 16,
        padding: 24,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>
          {title}
        </h2>

        <span style={{ color, fontSize: 22, fontWeight: 700 }}>
          {latest.toFixed(1)}%
        </span>
      </div>

      <div style={{ color: "#94a3b8", fontSize: 12 }}>
        Scale: 0–{maximum}%
      </div>

      <svg
        viewBox="0 0 600 160"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${title} historical performance`}
        style={{
          width: "100%",
          height: 190,
          marginTop: 10,
          overflow: "visible",
        }}
      >
        {[20, 82.5, 145].map((y) => (
          <line
            key={y}
            x1="12"
            y1={y}
            x2="588"
            y2={y}
            stroke="#29354a"
            strokeWidth="1"
          />
        ))}

        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#94a3b8",
          fontSize: 12,
          marginTop: 8,
        }}
      >
        <span>
          {firstTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>
          {lastTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default function HistoryCharts() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await fetch("/api/monitor/history", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("History unavailable");
        }

        const data: { samples: Sample[] } =
          await response.json();

        // Display measurements from the past hour only
        const cutoff = Date.now() - 60 * 60 * 1000;
        const recent = data.samples.filter(
          (sample) =>
            Date.parse(sample.timestamp) >= cutoff &&
            Date.parse(sample.timestamp) <= Date.now()
        );

        if (active) {
          setSamples(recent);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();
    const timer = setInterval(loadHistory, 15000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <section style={{ marginTop: 32 }}>
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        Performance History
      </h2>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: 24,
        }}
      >
        Recorded server performance over the past hour.
        Updated every 15 seconds.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: 16 }}>
          Unable to update historical measurements.
        </p>
      )}

      {samples.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 20,
          }}
        >
          <PerformanceGraph
            title="CPU Usage"
            samples={samples}
            metric="cpu_percent"
            color="#38bdf8"
          />

          <PerformanceGraph
            title="Memory Usage"
            samples={samples}
            metric="memory_percent"
            color="#a78bfa"
          />

          <PerformanceGraph
            title="Disk Usage"
            samples={samples}
            metric="disk_percent"
            color="#fbbf24"
          />
        </div>
      ) : (
        <p style={{ color: "#94a3b8" }}>
          {loading
            ? "Loading performance history..."
            : "No recent measurements available."}
        </p>
      )}
    </section>
  );
}

