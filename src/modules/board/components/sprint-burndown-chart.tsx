"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetSprintBurndownQuery } from "@/features/sprint";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Đường "ideal" trong response chỉ có 2 điểm neo (đầu/cuối Sprint) — nội suy
// tuyến tính ra giá trị tại đúng ngày của mỗi điểm "actual" để 2 đường dùng
// chung 1 trục X, vẽ được trên cùng 1 LineChart.
function interpolateIdeal(
  idealLine: { date: string; remainingPoints: number }[],
  targetTime: number,
): number {
  const [start, end] = idealLine;
  const startTime = new Date(start.date).getTime();
  const endTime = new Date(end.date).getTime();
  if (targetTime <= startTime) return start.remainingPoints;
  if (targetTime >= endTime) return end.remainingPoints;
  const ratio = (targetTime - startTime) / (endTime - startTime);
  return start.remainingPoints + (end.remainingPoints - start.remainingPoints) * ratio;
}

export function SprintBurndownChart({ sprintId }: { sprintId: string }) {
  const { data: burndown, isLoading } = useGetSprintBurndownQuery(sprintId);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/50" />;
  }

  if (!burndown || burndown.actualLine.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
        No burndown data yet.
      </p>
    );
  }

  const chartData = burndown.actualLine.map((point) => ({
    date: formatDate(point.date),
    actual: point.remainingPoints,
    ideal:
      Math.round(
        interpolateIdeal(burndown.idealLine, new Date(point.date).getTime()) * 10,
      ) / 10,
  }));

  return (
    <div className="h-64 w-full rounded-xl border border-border/60 bg-card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: "Story Points", angle: -90, position: "insideLeft", fontSize: 12 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ideal"
            name="Ideal"
            stroke="var(--muted-foreground)"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
