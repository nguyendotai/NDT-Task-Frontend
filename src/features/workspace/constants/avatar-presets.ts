export interface WorkspaceAvatarPreset {
  emoji: string;
  color: string;
}

// Phải khớp với backend/src/modules/workspace/workspace-avatar-presets.ts
// (giữ đồng bộ thủ công vì cả 2 phía cùng cần biết danh sách hợp lệ).
export const WORKSPACE_AVATAR_PRESETS: WorkspaceAvatarPreset[] = [
  { emoji: "🐵", color: "blue" },
  { emoji: "🦊", color: "orange" },
  { emoji: "🐼", color: "slate" },
  { emoji: "🦄", color: "pink" },
  { emoji: "🐙", color: "purple" },
  { emoji: "🚀", color: "sky" },
  { emoji: "🌈", color: "rose" },
  { emoji: "🔥", color: "red" },
  { emoji: "🌊", color: "cyan" },
  { emoji: "🍀", color: "green" },
  { emoji: "🎯", color: "amber" },
  { emoji: "💎", color: "teal" },
  { emoji: "🦁", color: "yellow" },
  { emoji: "🐨", color: "gray" },
  { emoji: "🐸", color: "lime" },
  { emoji: "🦋", color: "fuchsia" },
];

// Tailwind chỉ giữ lại class xuất hiện dạng chuỗi tĩnh trong source — không
// được ghép chuỗi động kiểu `from-${color}-500`, nên khai báo sẵn từng cặp.
const WORKSPACE_AVATAR_GRADIENTS: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  orange: "from-orange-500 to-orange-600",
  slate: "from-slate-500 to-slate-600",
  pink: "from-pink-500 to-pink-600",
  purple: "from-purple-500 to-purple-600",
  sky: "from-sky-500 to-sky-600",
  rose: "from-rose-500 to-rose-600",
  red: "from-red-500 to-red-600",
  cyan: "from-cyan-500 to-cyan-600",
  green: "from-green-500 to-green-600",
  amber: "from-amber-500 to-amber-600",
  teal: "from-teal-500 to-teal-600",
  yellow: "from-yellow-500 to-yellow-600",
  gray: "from-gray-500 to-gray-600",
  lime: "from-lime-500 to-lime-600",
  fuchsia: "from-fuchsia-500 to-fuchsia-600",
};

export function getWorkspaceAvatarGradient(color: string): string {
  return WORKSPACE_AVATAR_GRADIENTS[color] ?? WORKSPACE_AVATAR_GRADIENTS.blue;
}
