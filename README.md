<div align="center">

<img src="public/logo.png" width="72" alt="NDT Task logo" />

# 🚀 NDT Task — Frontend

**Task Management SaaS đa nền tảng** — Workspace → Board → Task, hỗ trợ cả **Kanban** lẫn **Scrum**.
Xây dựng bằng Next.js (App Router), Redux Toolkit + RTK Query, realtime bằng Socket.IO.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-RTK%20Query-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)

[Backend repo](https://github.com/nguyendotai/NDT-Task-Backend) · [Báo lỗi / góp ý](../../issues)

</div>

---

## 📖 Giới thiệu

**NDT Task** là ứng dụng quản lý công việc kiểu Jira/Trello thu nhỏ: mỗi **Workspace** (nhóm/dự án) chứa 1 **Board**, Board chia thành nhiều **Column**, mỗi Column chứa nhiều **Task**. Workspace có thể chọn kiểu **Kanban** (dòng chảy liên tục) hoặc **Scrum** (chia theo Sprint, có Burndown/Velocity Chart).

Repo này là **giao diện web** (Next.js, gọi API từ [repo Backend](https://github.com/nguyendotai/NDT-Task-Backend)).

## ✨ Tính năng nổi bật

| Nhóm | Tính năng |
| :--- | :--- |
| 🔐 **Xác thực** | Đăng ký/đăng nhập Email + Password, nút **Continue with Google**, **2FA (quét QR)** tuỳ chọn trong Profile, quên/đổi mật khẩu |
| 🗂️ **Board** | Kéo-thả Task/Column mượt (dnd-kit, optimistic update), thanh Search + Filter đa tiêu chí, hiển thị Priority/Type/mã Task, xem trước ảnh & PDF ngay trong Attachment |
| 🏃 **Scrum** | Board riêng cho Backlog/Sprint, **Burndown Chart** & **Velocity Chart** (recharts) |
| ⏱️ **Time Tracking** | Ghi giờ làm việc trực tiếp trong Task Detail Modal |
| 💬 **Cộng tác** | Comment, Checklist, Label, Watcher, tab **Activity** (audit trail) cấp Workspace, Docs rich-text |
| 🔔 **Notification** | Chuông thông báo realtime, tự tuỳ chỉnh bật/tắt theo từng loại trong Profile |
| ⚡ **Realtime** | Mọi thay đổi (Task/Column/Sprint/Comment...) đồng bộ tức thời cho mọi người đang mở cùng Workspace qua Socket.IO, kèm chấm Online/Typing indicator |
| 🔍 **Tìm kiếm** | Search toàn hệ thống, bấm kết quả nhảy thẳng vào đúng Task; Export danh sách Task ra CSV |
| 🎨 **Giao diện** | Dark/Light theme, thiết kế glassmorphism + Brand Gradient, responsive |

## 🛠️ Công nghệ sử dụng

- **Framework**: [Next.js](https://nextjs.org) 16 (App Router, TypeScript strict mode)
- **State**: [Redux Toolkit](https://redux-toolkit.js.org) + **RTK Query** (toàn bộ dữ liệu server, cache/tag tự invalidate)
- **UI**: Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) (dựng trên [Base UI](https://base-ui.com)), [Framer Motion](https://www.framer.com/motion)
- **Form & Validate**: React Hook Form + Zod
- **Kéo-thả**: [dnd-kit](https://dndkit.com)
- **Biểu đồ**: [Recharts](https://recharts.org) (Burndown/Velocity)
- **Realtime**: [socket.io-client](https://socket.io)
- **Thông báo UI**: [sonner](https://sonner.emilkowal.ski) (toast)
- **Rich text**: [Tiptap](https://tiptap.dev) (module Docs)

## 📂 Cấu trúc thư mục

```
src/
├── app/              # Next.js App Router — chỉ Layout/Page/Route, KHÔNG chứa logic
│   ├── (auth)/           # /login, /register, /forgot-password...
│   └── (dashboard)/      # /dashboard, /workspaces, /profile... (yêu cầu đăng nhập)
├── features/          # Logic + API theo domain, dùng lại được ở nhiều Page
│   ├── auth/ user/ workspace/ task/ sprint/ comment/ ...
│   └── mỗi feature: api/ (RTK Query) · components/ · hooks/ · schemas/ (Zod) · types/
├── modules/           # UI ghép nhiều feature lại thành 1 màn hình hoàn chỉnh
│   ├── board/            # Board Kanban/Scrum, Task Detail Modal, Settings...
│   ├── dashboard/        # Trang chủ, Profile
│   └── search/            # Trang tìm kiếm
├── shared/             # Dùng chung ≥2 feature: components/ui (shadcn), hooks, lib, services
├── store/              # Redux store setup
└── configs/            # Biến môi trường, cấu hình socket
```

## 🚀 Bắt đầu nhanh

### Yêu cầu

- Node.js 20+
- [Backend API](https://github.com/nguyendotai/NDT-Task-Backend) đã chạy sẵn (local hoặc deploy) — Frontend không hoạt động độc lập được

### Cài đặt

```bash
npm install
cp .env.example .env.local   # rồi điền giá trị thật (xem bảng bên dưới)
npm run dev                   # http://localhost:3000
```

### Biến môi trường (`.env.local`)

| Biến | Mô tả |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL gốc của Backend API, VD `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_SOCKET_URL` | URL Socket.IO của Backend (thường là domain Backend, không có `/api/v1`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Bật nút "Continue with Google" — để trống thì nút tự ẩn |

> ⚠️ **Lưu ý khi deploy** (Vercel...): biến `NEXT_PUBLIC_*` được nhúng cứng vào bundle **lúc build**, không đọc lúc chạy — đổi giá trị trên dashboard hosting xong phải **Redeploy lại** (bỏ cache build) thì mới có tác dụng.

### Các lệnh hay dùng

```bash
npm run dev      # Chạy dev server, hot reload
npm run build     # Build production
npm run start      # Chạy bản build
npm run lint       # ESLint
```

## 🔗 Repo liên quan

- **Backend**: [github.com/nguyendotai/NDT-Task-Backend](https://github.com/nguyendotai/NDT-Task-Backend)
