"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetWorkspaceVelocityQuery } from "@/features/sprint";

export function WorkspaceVelocityChart({ workspaceId }: { workspaceId: string }) {
  const { data: velocity, isLoading } = useGetWorkspaceVelocityQuery(workspaceId);

  if (isLoading) {
    return <div className="h-56 animate-pulse rounded-xl bg-muted/50" />;
  }

  if (!velocity || velocity.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
        No completed Sprint yet — velocity shows up here once a Sprint finishes.
      </p>
    );
  }

  const chartData = velocity.map((entry) => ({
    name: entry.sprintName,
    velocity: entry.velocity,
  }));

  return (
    <div className="h-56 w-full rounded-xl border border-border/60 bg-card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: "Story Points", angle: -90, position: "insideLeft", fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="velocity" name="Velocity" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
