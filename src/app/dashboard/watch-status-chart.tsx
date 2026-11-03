"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StatusCount } from "@/lib/dashboard";

const colors = ["#f6c85f", "#d65a4a", "#6e3b5d"];

export function WatchStatusChart({ data }: { data: StatusCount[] }) {
  const hasEntries = data.some((item) => item.count > 0);

  return (
    <div>
      <div
        role="img"
        aria-label={`Watch status chart. ${data.map((item) => `${item.status}: ${item.count}`).join(", ")}.`}
        className="h-72 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 8, left: -24, bottom: 8 }}>
            <CartesianGrid stroke="#6e3b5d" strokeDasharray="4 5" opacity={0.15} />
            <XAxis
              dataKey="status"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#492740", fontSize: 12, fontWeight: 700 }}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              domain={[0, "dataMax"]}
              tickLine={false}
              tick={{ fill: "#6e3b5d", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "#6e3b5d", opacity: 0.06 }}
              contentStyle={{
                background: "#fff1d6",
                border: "1px solid rgba(110, 59, 93, 0.2)",
                borderRadius: "16px",
                color: "#261b2a",
              }}
            />
            <Bar dataKey="count" name="Titles" radius={[12, 12, 3, 3]} isAnimationActive={false}>
              {data.map((item, index) => (
                <Cell key={item.status} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!hasEntries && (
        <p className="-mt-3 text-center text-sm font-semibold text-[#6e3b5d]">
          Add a title to start filling in this chart.
        </p>
      )}

      <ul className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Watch status totals">
        {data.map((item, index) => (
          <li
            key={item.status}
            className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 text-sm"
          >
            <span className="flex items-center gap-2 font-semibold text-[#492740]">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              {item.status}
            </span>
            <span className="font-black text-[#261b2a]">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
