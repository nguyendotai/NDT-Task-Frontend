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
