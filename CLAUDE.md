# Frontend Claude Instructions
> Version: 1.0 (Optimized)

Tài liệu quy định toàn bộ tiêu chuẩn phát triển Frontend dự án NDT Task (`frontend/`). AI phải tuân thủ cả tài liệu `.claude/` (ưu tiên theo thứ tự: Business Rules -> Architecture -> frontend/CLAUDE.md -> Coding Style -> Folder Structure).

## 1. TECH STACK & FRAMEWORK
- React, Next.js (App Router, cấm Pages Router, cấm API Route FE), TypeScript (strict-mode, cấm `any`/`as`), Tailwind CSS (Mobile First, cấm CSS thuần/`!important`), Redux Toolkit, RTK Query, React Hook Form, Zod, Framer Motion, shadcn/ui.
- React: Functional Component + Hooks. Cấm Class Component/Legacy Context. Component <300 dòng.

## 2. STATE MANAGEMENT & API CALLS
- **Server Data**: Quản lý bằng **RTK Query** (Query, Mutation, Cache, Tags, Invalidate Cache). *Cấm dùng useState, Redux Slice để lưu data Server*. *Cấm dùng Axios, fetch() trực tiếp trong Component*.
- **Global UI State**: Quản lý bằng **Redux Toolkit** (chỉ dùng cho Auth, Theme, Sidebar, Modal, Notification, UI State). State cục bộ dùng useState/useReducer.
- **API Layer**: Đặt trong `features/<feature>/api/` để định nghĩa endpoint/cache/map data. Cấm chứa business logic.

## 3. BUSINESS LOGIC, VALIDATION & SERVER COMPONENTS    
- **Business Logic**: Phải nằm trong `services/` hoặc `hooks/`. Cấm viết trong Component/Page/Layout.
- **Validation**: Dùng **Zod Schema** đặt trong `schemas/`. Cấm viết validate JavaScript thuần trong Component.
- **React Hook Form**: Dùng cho Form. Phải có: Default Value, Validation, Loading/Error State.
- **Server Component**: Ưu tiên mặc định. Chỉ dùng `"use client"` khi cần useState, useEffect, Event Handler, Browser API, Animation.
- **Shared**: Chỉ đưa vào `shared/` khi có ít nhất 2 feature cùng sử dụng.

## 4. UX, ACCESSIBILITY & PERFORMANCE
- **UX**: Đảm bảo đầy đủ Loading State (Skeleton, Spinner), Empty State, Error State (có Retry).
- **Accessibility**: Bắt buộc nhãn Form, Keyboard Navigation, Focus State, Aria Attributes.
- **Performance**: Lazy loading, Dynamic Import, Memo, Virtual List (danh sách lớn), Next.js Image.
- **CẤM**: Axios, gọi API trực tiếp trong UI, Logic nghiệp vụ trong JSX, Validation trong component, "use client" thừa, CSS thủ công.

## 5. DOD (DEFINITION OF DONE)
Build thành công; không lỗi TS/ESLint; Responsive; có đủ UI States; không đổi code ngoài phạm vi; cập nhật CHANGELOG.md và PROJECT_STATUS.md.

## 6. DESIGN SYSTEM (DASHBOARD REFERENCE)
> Phân tích từ ảnh reference dashboard phong cách "G.Take" (dark, glassmorphism, gradient xanh-tím, bo góc lớn). Áp dụng cho Dashboard/Board/Task layout. Biến CSS map theo đúng token shadcn/ui hiện có trong `src/app/globals.css` (`:root` = light, `.dark` = dark).

### 6.1 Border Radius Scale
Tăng `--radius` gốc từ mặc định `0.625rem` lên `~1.125rem–1.25rem` (18–20px) để khớp độ bo tròn lớn trong ảnh, các bậc còn lại tính theo hệ số có sẵn (`--radius-sm/md/lg/xl/2xl/3xl/4xl`).

| Token | ~Px (base 1.25rem) | Dùng cho |
| :--- | :--- | :--- |
| `--radius-sm` | 12px | input nhỏ, checkbox, icon 16px |
| `--radius-md` | 16px | icon square (app icon, avatar vuông) |
| `--radius-lg` (base) | 20px | Task Card, Panel, Sidebar item |
| `--radius-xl` | 28px | Section/Container lớn |
| `--radius-2xl` | 36px | Outer shell/App frame |
| `rounded-full` (Tailwind, không qua token) | 9999px | Button pill, Avatar, Badge trạng thái, Progress bar |

Quy tắc: Card/Panel dùng `rounded-[var(--radius-lg)]` (≈ Tailwind `rounded-2xl`), Button/Filter/Badge dùng `rounded-full`, Icon-button dùng `rounded-xl`. Cấm bo góc < 12px trừ input/checkbox nhỏ.

### 6.2 Background & Surface
- **Dark (mặc định theo ảnh)**: nền tối navy gần đen, có thể phủ gradient/radial glow (xanh dương → tím) rất nhạt phía sau hero/dashboard. Card = **glassmorphism**: nền bán trong suốt + `backdrop-blur` + border 1px trắng mờ.
- **Light (suy ra, giữ cùng tông thương hiệu)**: nền trắng/xám rất nhạt, Card đặc màu trắng, dùng shadow nhẹ thay cho glow/blur (glow không phù hợp nền sáng).
- Nav/Sidebar active item, CTA chính, progress fill dùng chung **Brand Gradient** (xem 6.4) ở cả 2 theme.

### 6.3 Color Tokens
| Token (biến hiện có) | Dark | Light |
| :--- | :--- | :--- |
| `--background` | `#0A0D18` | `#F7F8FC` |
| `--foreground` | `#F4F6FB` | `#12131A` |
| `--card` | `rgba(22,26,45,.6)` (blur) / `#12162A` fallback | `#FFFFFF` |
| `--card-foreground` | `#F4F6FB` | `#12131A` |
| `--popover` | `#12162A` | `#FFFFFF` |
| `--primary` | `#4C7DFB` (solid fallback của gradient) | `#3B82F6` |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--secondary` | `#1B2036` | `#EEF0F6` |
| `--secondary-foreground` | `#E4E7F2` | `#12131A` |
| `--muted` | `#171B2E` | `#F1F2F7` |
| `--muted-foreground` | `#8A90A6` | `#6B7280` |
| `--accent` | `#1E2440` | `#EEF1FF` |
| `--accent-foreground` | `#F4F6FB` | `#12131A` |
| `--destructive` | `#EF4444` | `#DC2626` |
| `--border` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.08)` |
| `--input` | `rgba(255,255,255,.10)` | `rgba(0,0,0,.10)` |
| `--ring` | `#4C7DFB` | `#3B82F6` |
| `--sidebar` | `#0B0F1C` | `#FFFFFF` |
| `--sidebar-foreground` | `#A8AEC2` | `#6B7280` |
| `--sidebar-primary` | Brand Gradient | Brand Gradient |
| `--sidebar-accent` (hover) | `rgba(255,255,255,.06)` | `#F1F2F7` |
| success (dot/status) | `#22C55E` | `#16A34A` |
| warning | `#F59E0B` | `#D97706` |
| `--chart-1..5` | `#93C5FD → #60A5FA → #3B82F6 → #8B5CF6 → #C4B5FD` | `#2563EB → #3B82F6 → #6D5CFB → #8B5CF6 → #A78BFA` |

### 6.4 Gradient & Effect
- **Brand Gradient** (nhận diện xuyên suốt 2 theme): `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)` — dùng cho: logo, nav item active, CTA button chính ("New task"), progress bar fill, từ khoá nhấn mạnh trong heading (`bg-clip-text text-transparent`).
- **Glow** (chỉ Dark theme): `box-shadow: 0 0 24px rgba(59,130,246,.35)` quanh phần tử active/CTA/avatar-add-button.
- **Glassmorphism** (chỉ Dark theme, cho Card/Panel): `background: rgba(22,26,45,.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,.08)`.
- **Light theme thay Glow/Glass bằng Elevation**: `box-shadow: 0 4px 16px rgba(16,24,40,.06)`, hover tăng nhẹ `0 8px 24px rgba(16,24,40,.08)`.

### 6.5 Component Pattern quan sát từ ảnh
- **Sidebar**: icon + label; item active = nền Brand Gradient bo `--radius-md`, có Glow (dark); item thường = icon màu `sidebar-foreground`, không nền.
- **Stat/Info Card**: `--radius-lg`, padding 20–24px, tiêu đề bold + icon-action góc phải (`rounded-full`, size 32–36px).
- **Task Card**: `--radius-lg`, có status dot (`success`/`primary`), avatar stack overlap (`-space-x-2`, border 2px màu `card` để tách viền), badge người tham gia dạng pill nhỏ nền `muted`.
- **Pill Button/Filter Dropdown**: `rounded-full`, padding ngang rộng (16–20px), icon chevron nhỏ bên phải, nền `secondary`/`muted`.
- **Progress Bar**: track `rounded-full` nền `muted`, fill Brand Gradient, badge % `rounded-full` nổi bật cuối thanh (nền `primary`, kèm Glow ở dark).
- **Chart Bar**: bo góc trên (`rounded-t-md`), bar thường dùng pattern gạch chéo/opacity thấp (`chart-2`/`chart-3` mờ), bar giá trị chính nổi bật dùng Brand Gradient đặc.

### 6.6 Typography Accent
- Heading lớn: `font-bold`, `text-3xl`~`text-4xl`, từ khoá nhấn mạnh dùng Brand Gradient text (`bg-clip-text text-transparent`).
- Body/description: `muted-foreground`, `text-sm`.
- Timestamp/meta: `text-xs`, `muted-foreground`, kèm icon 12–14px.

### 6.7 Áp dụng
- Mọi Card/Panel/Button mới bắt buộc dùng token ở trên qua Tailwind theme (`bg-card`, `text-muted-foreground`, `rounded-[var(--radius-lg)]`...). Cấm hardcode mã màu/bo góc tuỳ tiện trong Component.
- Dark là theme mặc định (đúng ảnh reference); Light theme suy ra tương đương ở mục 6.3, giữ cùng Brand Gradient để nhất quán nhận diện.
- Bảng màu ở mục 6.3 là **giá trị tham chiếu để implement** vào `:root`/`.dark` trong `src/app/globals.css` — chưa áp dụng vào code ở lần cập nhật tài liệu này.
