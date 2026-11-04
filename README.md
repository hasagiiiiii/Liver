# Liver Design System & Admin Management

Hệ thống **Liver Design System** và Quản trị ứng dụng được phát triển trên nền tảng **Angular 19+ (Standalone Components)** kết hợp **TailwindCSS**, tuân thủ nguyên tắc thiết kế Atomic & Clean Architecture, bảng màu biến hóa linh hoạt theo phong cách **Crimson Red & Liver Black Tech**.

---

## 🗂️ Cấu trúc thư mục

- [`docs/`](./docs/): Tài liệu hướng dẫn phát triển và cấu trúc hệ thống:
  - [`docs/project-structure.md`](./docs/project-structure.md): Chi tiết sơ đồ cây thư mục toàn dự án.
  - [`docs/skill.md`](./docs/skill.md): Quy chuẩn kỹ thuật, danh mục Shared UI Components và BaseComponent bắt buộc tuân theo.
- [`liver-design-system/`](./liver-design-system/): Mã nguồn dự án Angular:
  - `src/app/core/`: Dịch vụ lõi, Interceptors, Guards, Hằng số Menu sidebar.
  - `src/app/features/`: Các module tính năng: Dashboard (demo form controls), Quản lý người dùng (Users), Báo cáo (Analytics).
  - `src/app/shared/components/`: Bộ sưu tập reusable UI controls (Table, Datepicker, Select, TreeSelect, InputNumber, BaseComponent, Logo hoạt họa SVG...).
  - `src/app/layouts/`: Main layout, Sidebar động, Theme Palette đổi màu linh hoạt.
- [`liver_ui_kit_admin_layout.html`](./liver_ui_kit_admin_layout.html): Bản mẫu UI Kit HTML độc lập.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- Node.js >= 18.x
- npm >= 9.x

### 2. Cài đặt thư viện
```bash
cd liver-design-system
npm install
```

### 3. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm start
# Ứng dụng sẽ chạy tại: http://localhost:4200/
```

### 4. Chạy Unit Tests
```bash
npm test
```

### 5. Build Production
```bash
npm run build
```
