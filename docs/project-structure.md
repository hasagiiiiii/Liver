# 📚 CẤU TRÚC DỰ ÁN LIVER DESIGN SYSTEM

Hệ thống **LIVER Design System** được xây dựng trên nền tảng **Angular 19+ (Standalone Components)** kết hợp với **TailwindCSS**, tuân thủ nguyên tắc thiết kế **Atomic & Clean Architecture**, tính mở rộng cao, không hardcode ("fix code") và đồng bộ giao diện theo phong cách **Crimson Red & Liver Black Tech**.

---

## 🗂️ SƠ ĐỒ CÂY THƯ MỤC TOÀN DỰ ÁN

```text
liver-design-system/
├── public/                                # Tài nguyên tĩnh (Favicon, icons...)
├── src/
│   ├── index.html                         # Entry HTML
│   ├── main.ts                            # Bootstrap standalone application
│   ├── styles.scss                        # Toàn bộ CSS biến theme, scrollbar, animations
│   ├── assets/
│   │   ├── icons/
│   │   │   └── liver-logo.svg             # File Logo chữ "L" SVG có animation (Laser, Glow, Pulse)
│   │   └── images/
│   │
│   └── app/
│       ├── app.component.ts               # Root component của ứng dụng
│       ├── app.routes.ts                  # Cấu hình Routing (Lazy loading, Auth & Admin shell)
│       ├── app.config.ts                  # Provider cấu hình (provideRouter, animations...)
│       │
│       ├── core/                          # Tầng lõi (Services, Guards, Interceptors, Constants)
│       │   ├── constants/
│       │   │   └── menu.constant.ts       # HẰNG SỐ DUY NHẤT định nghĩa danh sách Menu Sidebar
│       │   ├── guards/
│       │   │   ├── auth.guard.ts          # Bảo vệ tuyến đường xác thực (Chặn truy cập nếu chưa login)
│       │   │   └── permission.guard.ts    # Phân quyền người dùng theo Role & Permissions
│       │   ├── interceptors/
│       │   │   ├── token.interceptor.ts   # Gắn Bearer JWT token vào Header
│       │   │   ├── loading.interceptor.ts # Quản lý spinner loading toàn cục
│       │   │   └── http-error.interceptor.ts # Bắt lỗi HTTP tập trung
│       │   └── services/
│       │       ├── auth.service.ts        # Quản lý đăng nhập, 2FA, đổi mật khẩu, RBAC permissions
│       │       ├── drawer.service.ts      # Service quản lý mở/đóng Drawer Slide-over toàn cục
│       │       ├── api.service.ts         # Service mock dữ liệu dự án, tree node
│       │       ├── user.service.ts        # Service giả lập API CRUD quản lý người dùng
│       │       ├── notification.service.ts # Service Toast thông báo (ToastService)
│       │       ├── modal.service.ts       # Service hộp thoại xác nhận (Confirm Dialog)
│       │       └── theme-palette.service.ts # Quản lý đổi bảng màu chủ đạo (Theme Switcher)
│       │
│       ├── layouts/                       # Khung giao diện dùng chung
│       │   ├── main-layout/
│       │   │   └── main-layout.component.ts # Shell Layout: Header, Breadcrumb, Drawer, Toasts, Fixed Toggle
│       │   ├── sidebar/
│       │   │   ├── sidebar.component.ts   # Sidebar động render từ menu.constant.ts
│       │   │   └── sidebar.component.spec.ts
│       │   └── theme-palette/
│       │       └── theme-palette.component.ts # Nút cài đặt và popup đổi màu theme nổi
│       │
│       ├── features/                      # Các màn hình nghiệp vụ chức năng (Lazy-loaded)
│       │   ├── auth/                      # Bộ trang Authentication hoàn chỉnh
│       │   │   ├── login/
│       │   │   │   └── login.component.ts # Đăng nhập hệ thống kèm Quick Demo Switcher
│       │   │   ├── forgot-password/
│       │   │   │   └── forgot-password.component.ts # Khôi phục mật khẩu gửi qua Email
│       │   │   └── verify-2fa/
│       │   │       └── verify-2fa.component.ts # Xác thực 2 bước 6 số OTP auto-focus
│       │   ├── profile/
│       │   │   └── profile.component.ts   # Hồ sơ cá nhân, Đổi mật khẩu, 2FA & Role Sandbox
│       │   ├── dashboard/
│       │   │   └── dashboard.component.ts # Màn hình Demo Form Controls & Data Table
│       │   ├── users/
│       │   │   ├── users.component.ts     # Màn hình Quản lý Người dùng (Filter, Table, Modal CRUD)
│       │   │   └── users.component.spec.ts
│       │   └── analytics/
│       │       └── analytics.component.ts # Màn hình Báo cáo phân tích số liệu
│       │
│       └── shared/                        # Tầng dùng chung (Reusability)
│           ├── components/
│           │   ├── base/
│           │   │   ├── base.component.ts  # BASE COMPONENT chuẩn cho toàn bộ dự án
│           │   │   └── index.ts
│           │   ├── logo/
│           │   │   ├── logo.component.ts  # Logo chữ L hoạt họa SVG Vector
│           │   │   └── logo.component.spec.ts
│           │   ├── table/
│           │   │   ├── table.interface.ts # Interface TableColumn, TableLazyLoadEvent, SortState...
│           │   │   ├── table.component.ts # Common Table (Ưu tiên Server-side, Sticky, Sort, Filter)
│           │   │   └── table.component.spec.ts
│           │   ├── file-upload/           # Component tải tệp tin Kéo & Thả (Drag & Drop Dropzone)
│           │   │   ├── file-upload.component.ts
│           │   │   ├── file-upload.component.spec.ts
│           │   │   └── index.ts
│           │   ├── drawer/                # Component bảng trượt Slide-over (Drawer Panel)
│           │   │   ├── drawer.component.ts
│           │   │   ├── drawer.component.spec.ts
│           │   │   └── index.ts
│           │   ├── tabs/                  # Component thẻ chuyển đổi phân trang nội dung
│           │   │   ├── tabs.component.ts
│           │   │   ├── tabs.component.spec.ts
│           │   │   └── index.ts
│           │   ├── input/
│           │   │   └── input.component.ts # Custom Text Input kèm Icon, Clearable
│           │   ├── input-number/
│           │   │   ├── input-number.component.ts # Input Number (Ẩn spin button mặc định)
│           │   │   └── input-number.component.spec.ts
│           │   ├── select/
│           │   │   └── select.component.ts # Single Select, Multi Select overflow, Tagging
│           │   ├── tree-select/
│           │   │   └── tree-select.component.ts # Dropdown cây phân cấp cha - con
│           │   ├── datepicker/
│           │   │   └── datepicker.component.ts # Chọn ngày lịch custom chuẩn Red-Black
│           │   ├── date-range/
│           │   │   └── date-range.component.ts # Chọn khoảng ngày (Date Range Picker)
│           │   └── textarea/
│           │       └── textarea.component.ts # Textarea đếm ký tự động
│           │
│           ├── directives/
│           │   ├── has-permission.directive.ts # Phân quyền giao diện (*appHasPermission="['ADMIN']")
│           │   ├── click-outside.directive.ts # Bắt sự kiện click ra ngoài để đóng Popup/Dropdown
│           │   ├── tooltip.directive.ts   # Custom Dark Tooltip
│           │   └── mask.directive.ts      # Mask định dạng tiền tệ và số
│           │
│           └── pipes/
│               ├── currency-vnd.pipe.ts   # Pipe format tiền tệ Việt Nam (VNĐ / ₫)
│               └── date-format.pipe.ts    # Pipe format ngày DD/MM/YYYY
│
└── docs/                                  # Thư mục tài liệu kỹ thuật & quy chuẩn phát triển
    ├── project-structure.md               # Bản mô tả chi tiết kiến trúc dự án
    └── skill.md                           # Quy tắc vàng và cẩm nang chuẩn mực AI phát triển
```
