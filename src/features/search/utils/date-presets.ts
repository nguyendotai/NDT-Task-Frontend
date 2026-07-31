export const UPDATED_PRESETS = [
  { key: "any", label: "Any time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Past 7 days" },
  { key: "30d", label: "Past 30 days" },
  { key: "1y", label: "Past year" },
] as const;

export type UpdatedPresetKey = (typeof UPDATED_PRESETS)[number]["key"];

// Backend chỉ nhận updatedFrom/updatedTo (ISO 8601) tường minh, không biết
// khái niệm "preset" — tính mốc ngày ở Frontend để Backend giữ generic.
export function getUpdatedRangeForPreset(
  preset: UpdatedPresetKey,
): { updatedFrom?: string; updatedTo?: string } {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "any":
      return {};
    case "today":
      return { updatedFrom: startOfToday.toISOString() };
    case "yesterday": {
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      return { updatedFrom: startOfYesterday.toISOString(), updatedTo: startOfToday.toISOString() };
    }
    case "7d": {
      const from = new Date(now);
      from.setDate(from.getDate() - 7);
      return { updatedFrom: from.toISOString() };
    }
    case "30d": {
      const from = new Date(now);
      from.setDate(from.getDate() - 30);
      return { updatedFrom: from.toISOString() };
    }
    case "1y": {
      const from = new Date(now);
      from.setFullYear(from.getFullYear() - 1);
      return { updatedFrom: from.toISOString() };
    }
  }
}
