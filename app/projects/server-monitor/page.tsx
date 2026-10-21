
"use client";
import HistoryCharts from "./HistoryCharts";
import { useEffect, useState } from "react";

type ServerStats = {
  timestamp: string;
  cpu_percent: number;
  memory_percent: number;
  memory_total: number;
  disk_percent: number;
  disk_total: number;
  uptime_seconds: number;
};

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function formatGB(bytes: number) {
  return (bytes / 1024 ** 3).toFixed(1) + " GB";
}

function MetricCard({
  title,
  value,
  detail,
  percent,
  color = "#38bdf8",
}: {
  title: string;
  value: string;
  detail: string;
  percent?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        background: "#151e31",
        border: "1px solid #29354a",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <p style={{ color: "#94a3b8", marginBottom: 12 }}>
        {title}
      </p>

      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#f8fafc",
          marginBottom: 12,
        }}
      >
        {value}
      </h2>

      {percent !== undefined && (
        <div
          style={{
            background: "#29354a",
            height: 8,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: `${Math.max(0, Math.min(100, percent))}%`,
              background: color,
              height: "100%",
              borderRadius: 8,
            }}
          />
        </div>
      )}

      <p style={{ color: "#94a3b8", fontSize: 13 }}>
        {detail}
      </p>
    </div>
  );
}

export default function ServerMonitor() {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const response = await fetch("/api/monitor", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Monitoring unavailable");
        }

        const data: ServerStats = await response.json();

        if (active) {
          setStats(data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }

    loadStats();

    const timer = setInterval(loadStats, 15000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1120",
        color: "#f8fafc",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <a
          href="/"
          style={{
            color: "#38bdf8",
            textDecoration: "none",
          }}
        >
          ← Back to Portfolio
        </a>

        <header style={{ marginTop: 40, marginBottom: 36 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700 }}>
            Server Monitoring Dashboard
          </h1>

          <p style={{ color: "#94a3b8", marginTop: 10 }}>
            Live system performance from my self-hosted
            Ubuntu server.
          </p>

          <p
            style={{
              marginTop: 18,
              color: error ? "#f87171" : "#4ade80",
              fontWeight: 600,
            }}
          >
            {error
              ? "● Monitoring unavailable"
              : stats
                ? "● Monitoring connected"
                : "● Connecting..."}
          </p>
        </header>

        {stats ? (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              <MetricCard
                title="CPU Usage"
                value={`${stats.cpu_percent}%`}
                detail="Current processor utilisation"
                percent={stats.cpu_percent}
              />

              <MetricCard
                title="Memory Usage"
                value={`${stats.memory_percent}%`}
                detail={`${formatGB(stats.memory_total)} total RAM`}
                percent={stats.memory_percent}
                color="#a78bfa"
              />

              <MetricCard
                title="Disk Usage"
                value={`${stats.disk_percent}%`}
                detail={`${formatGB(stats.disk_total)} total storage`}
                percent={stats.disk_percent}
                color="#fbbf24"
              />

              <MetricCard
                title="System Uptime"
                value={formatUptime(stats.uptime_seconds)}
                detail="Time since last system boot"
                color="#4ade80"
              />
            </section>

            <section
              style={{
                background: "#151e31",
                border: "1px solid #29354a",
                borderRadius: 16,
                padding: 24,
                marginTop: 24,
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>
                System Information
              </h2>

              <p style={{ color: "#94a3b8", marginTop: 12 }}>
                Operating System: Ubuntu Linux
              </p>

              <p style={{ color: "#94a3b8", marginTop: 8 }}>
                Last measurement:{" "}
                {new Date(stats.timestamp).toLocaleString()}
              </p>

              <p style={{ color: "#94a3b8", marginTop: 8 }}>
                Refresh interval: 15 seconds
              </p>
            </section>
            <HistoryCharts />

          </>
        ) : (
          <p style={{ color: "#94a3b8" }}>
            {error
              ? "Unable to retrieve server statistics."
              : "Loading server statistics..."}
          </p>
        )}

        <footer
          style={{
            marginTop: 40,
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Self-hosted monitoring built with Next.js,
          Python, Docker and systemd.
        </footer>
      </div>
    </main>
  );
}

