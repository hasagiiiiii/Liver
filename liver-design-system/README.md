# LIVER Enterprise Design System (Angular 19/22+ & Tailwind CSS)

Hệ thống Design System doanh nghiệp cao cấp xây dựng trên nền tảng **Angular phiên bản mới nhất** (Standalone Components, Signals, Reactive Forms, ControlValueAccessor) kết hợp cùng **Tailwind CSS**.

---

## 🎨 Tone Màu & Theme Palette Switcher

Giao diện áp dụng tone màu chuẩn **Đen (#0a0a0c) - Đỏ Crimson (#dc2626) - Trắng (#ffffff)**, tích hợp bộ chuyển đổi bảng màu nổi (Floating Setting Button) tại góc phải dưới màn hình:
1. **Đen - Đỏ - Trắng** (Mặc định - Crimson)
2. **Đen - Vàng Gold - Trắng** (Gold)
3. **Đen - Xanh Ngọc - Trắng** (Emerald)
4. **Đen Navy - Xanh Dương - Trắng** (Cobalt)
5. **Đen Tím - Violet - Trắng** (Violet)

Hệ thống màu sắc được cấu hình động thông qua CSS Custom Properties (`:root`) và kết nối với Tailwind token:
- `liver-black`: `var(--liver-black)`
- `liver-dark`: `var(--liver-dark)`
- `liver-panel`: `var(--liver-panel)`
- `liver-red`: `var(--liver-red)`
- `liver-redHover`: `var(--liver-red-hover)`
- `liver-redLight`: `var(--liver-red-light)`
- `liver-redBorder`: `var(--liver-red-border)`

---

## 📁 Cấu Trúc Thư Mục Chuẩn Enterprise

```
liver-design-system/
├── .browserslistrc
├── angular.json
├── package.json
├── tsconfig.json
├── tailwind.config.js          <-- Định nghĩa Design Tokens (Màu sắc Đen - Đỏ - Trắng)
└── src/
    ├── index.html              <-- Điểm vào chính ứng dụng (Font Inter, Font Awesome 6.5)
    ├── main.ts                 <-- Bootstrap Standalone Application
    ├── styles.scss             <-- Global styles, Scrollbar, Tailwind directives & CSS Variables
    ├── assets/
    │   ├── icons/              <-- SVG Icons tùy chỉnh (Logo LIVER, v.v.)
    │   └── images/
    ├── app/
    │   ├── app.component.ts    <-- Root Component
    │   ├── app.config.ts       <-- Cấu hình Providers (Animations, Router, HTTP Interceptors)
    │   ├── app.routes.ts       <-- Định tuyến chính (Lazy Loading)
    │   │
    │   ├── core/               <-- Core Module / Singleton Services (Chỉ khởi tạo 1 lần)
    │   │   ├── guards/         <-- AuthGuard, PermissionGuard
    │   │   ├── interceptors/   <-- HttpError, Token, Loading Interceptors
    │   │   └── services/       <-- ThemePaletteService, NotificationService, ApiService
    │   │
    │   ├── shared/             <-- Shared Module / Reusable Components & Directives
    │   │   ├── components/     <-- Các atom/molecule UI Controls dùng chung
    │   │   │   ├── input/           <-- Icon trái, clear nhanh, CVA
    │   │   │   ├── input-number/    <-- Nút (+/-), định dạng tiền tệ VNĐ trực tiếp
    │   │   │   ├── datepicker/      <-- Custom calendar popup đồng bộ giao diện
    │   │   │   ├── date-range/      <-- Calendar range picker + 7N/30N quick presets
    │   │   │   ├── select/          <-- Hỗ trợ Single, Multi (+N Tag overflow), Tagging
    │   │   │   ├── tree-select/     <-- Cây phân cấp phòng ban đóng/mở linh hoạt
    │   │   │   ├── textarea/        <-- Bộ đếm ký tự (Character Count)
    │   │   │   └── table/           <-- Sticky Header, Sticky Columns, Multi-Sort
    │   │   ├── directives/     <-- ClickOutsideDirective, TooltipDirective, MaskDirective
    │   │   └── pipes/          <-- CurrencyVNDPipe, DateFormatPipe
    │   │
    │   ├── layouts/            <-- Cấu trúc Layout hệ thống chính
    │   │   ├── main-layout/    <-- Gồm Header (Logo LIVER, Breadcrumb), Sidebar, Content
    │   │   ├── sidebar/        <-- Menu đa cấp, co giãn collapse/expand, thông tin bản quyền
    │   │   └── theme-palette/  <-- Floating Setting Theme Palette
    │   │
    │   └── features/           <-- Các Module/Feature kinh doanh chính
    │       ├── dashboard/      <-- Dashboard trang chủ hiển thị UI Kit & Data Table
    │       └── analytics/      <-- Báo cáo thống kê & KPIs
```

---

## ⚡ Các Tính Năng Kỹ Thuật Đạt Chuẩn

1. **Standalone Components & Angular Signals**: Không cần NgModule rườm rà, hiệu năng vượt trội, nạp lười (lazy loading) từng feature route.
2. **ControlValueAccessor (CVA)**: Tất cả Form Controls tích hợp hoàn hảo với **Angular Reactive Forms** (`formControlName`) và `[(ngModel)]`.
3. **Data Table chuyên sâu**:
   - **Sticky Header**: Cố định hàng tiêu đề khi cuộn dọc.
   - **Sticky Columns**: Cột "Mã Dự Án" cố định bên trái (`sticky-col-left`) và cột "Thao Tác" cố định bên phải (`sticky-col-right`) khi cuộn ngang, có đổ bóng phân tách.
   - **Multi-Sort**: Nhấp chọn tiêu đề cột để sắp xếp tăng/giảm kèm icon trực quan (`fa-sort`, `fa-sort-up`, `fa-sort-down`).
   - **Realtime Filter**: Tìm kiếm trực tiếp theo mã, tên, phòng ban kết hợp lọc theo trạng thái (`Active`, `Pending`, `Critical`).
   - **Interactive CRUD**: Thêm dòng mới vào bảng trực tiếp từ dữ liệu của Form Controls, chỉnh sửa đưa ngược lên form, xóa có thông báo Toast.
4. **ng-Select 3 kịch bản**:
   - **Single Select**: Chọn 1 giá trị, ô tìm kiếm tích hợp, icon avatar, nút clear nhanh.
   - **Multiple Select**: Tự động tính toán tràn chiều rộng và gom các tag ẩn thành huy hiệu `+N tag`, hover hiển thị tooltip chi tiết danh sách tag ẩn.
   - **Tag Select (`[addTag]="true"`)**: Gõ từ khóa và bấm `Enter` để tạo tag mới; hỗ trợ 3 phân loại trạng thái: `locked` (cố định), `accent`/`critical` (khẩn cấp), `default` (mặc định).
5. **Datepicker & Date-Range**:
   - Đồng bộ thiết kế lịch tuần (T2 - CN), chuyển tháng mượt mà, chọn nhanh "Hôm nay", "7 ngày qua", "30 ngày qua", tự tính và hiển thị số ngày được chọn.
6. **Input Number**:
   - Nút tăng giảm linh hoạt theo `step` (500.000 ₫), đồng thời hiển thị preview định dạng tiền tệ VNĐ tự động (`15.500.000 ₫`).
7. **Tree-Select**:
   - Hiển thị cây phân cấp phòng ban cha - con, nút mở rộng tất cả, chọn nhánh con tự động cập nhật breadcrumb đường dẫn đầy đủ.

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Cài đặt dependencies (đã cài sẵn):
```bash
cd liver-design-system
npm install
```

### 2. Chạy môi trường Development:
```bash
npm start
```
Truy cập ứng dụng tại: `http://localhost:4200`

### 3. Build Production:
```bash
npm run build
```

### 4. Chạy Unit Tests:
```bash
npm test -- --watch=false
```
