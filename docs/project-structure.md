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
│       ├── app.routes.ts                  # Cấu hình Routing (Lazy loading)
│       ├── app.config.ts                  # Provider cấu hình (provideRouter, animations...)
│       │
│       ├── core/                          # Tầng lõi (Services, Guards, Interceptors, Constants)
│       │   ├── constants/
│       │   │   └── menu.constant.ts       # HẰNG SỐ DUY NHẤT định nghĩa danh sách Menu Sidebar
│       │   ├── guards/
│       │   │   ├── auth.guard.ts          # Bảo vệ tuyến đường xác thực
│       │   │   └── permission.guard.ts    # Phân quyền người dùng theo Role
│       │   ├── interceptors/
│       │   │   ├── token.interceptor.ts   # Gắn Bearer JWT token vào Header
│       │   │   ├── loading.interceptor.ts # Quản lý spinner loading toàn cục
│       │   │   └── http-error.interceptor.ts # Bắt lỗi HTTP tập trung
│       │   └── services/
│       │       ├── api.service.ts         # Service mock dữ liệu dự án, tree node
│       │       ├── user.service.ts        # Service giả lập API CRUD quản lý người dùng
│       │       ├── notification.service.ts # Service Toast thông báo (ToastService)
│       │       ├── modal.service.ts       # Service hộp thoại xác nhận (Confirm Dialog)
│       │       └── theme-palette.service.ts # Quản lý đổi bảng màu chủ đạo (Theme Switcher)
│       │
│       ├── layouts/                       # Khung giao diện dùng chung
│       │   ├── main-layout/
│       │   │   └── main-layout.component.ts # Shell Layout: Header, Breadcrumb, Nút toggle Fixed
│       │   ├── sidebar/
│       │   │   ├── sidebar.component.ts   # Sidebar động render từ menu.constant.ts
│       │   │   └── sidebar.component.spec.ts
│       │   └── theme-palette/
│       │       └── theme-palette.component.ts # Nút cài đặt và popup đổi màu theme nổi
│       │
│       ├── features/                      # Các màn hình nghiệp vụ chức năng (Lazy-loaded)
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
│           │   │   ├── table.interface.ts # Interface TableColumn, SortState, Action...
│           │   │   ├── table.component.ts # Common Table (Sorting, Search, Sticky, Checkbox...)
│           │   │   └── table.component.spec.ts
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
│           │   ├── click-outside.directive.ts # Bắt sự kiện click ra ngoài để đóng Popup/Dropdown
│           │   ├── click-outside.directive.spec.ts
│           │   ├── tooltip.directive.ts   # Custom Dark Tooltip
│           │   └── mask.directive.ts      # Mask định dạng tiền tệ và số
│           │
│           └── pipes/
│               ├── currency-vnd.pipe.ts   # Pipe format tiền tệ Việt Nam (VNĐ / ₫)
│               └── date-format.pipe.ts    # Pipe format ngày DD/MM/YYYY
│
└── docs/                                  # Thư mục tài liệu kỹ thuật & quy chuẩn phát triển
    ├── project-structure.md               # Bản mô tả chi tiết kiến trúc dự án
    └── skill.md                           # Bản quy chuẩn bắt buộc AI tuân thủ khi viết mã
```

---

## 🏛️ CHI TIẾT CÁC PHÂN TẦNG KIẾN TRÚC

### 1. `core/` (Tầng lõi hệ thống)
- **Singleton Services**: Khởi tạo với `{ providedIn: 'root' }`.
- **`user.service.ts`**: Cung cấp dữ liệu dummy giả lập gọi API bất đồng bộ với `delay()`, quản lý trạng thái qua Signal `users`, hỗ trợ đầy đủ thêm/sửa/xóa đơn/xóa hàng loạt.
- **`notification.service.ts` (alias `ToastService`)**: Cung cấp hàm `show(message, type, duration)` để hiển thị toast thông báo nổi góc trên màn hình.
- **`modal.service.ts`**: Cung cấp hàm `confirm(options): Promise<boolean>` mở popup xác nhận thao tác nguy hiểm hoặc duyệt lệnh.
- **`menu.constant.ts`**: Nơi **duy nhất** khai báo danh mục Sidebar menu (`MENU_ITEMS`).

### 2. `shared/` (Tầng dùng chung)
- **`BaseComponent`** (`src/app/shared/components/base/base.component.ts`):
  - Lớp trừu tượng cha cho tất cả các feature component.
  - Tự động inject sẵn `ToastService`, `ModalService`, `Router`, `ActivatedRoute`, `FormBuilder`, `DestroyRef`.
  - Cung cấp sẵn các biến cờ: `loading`, `isSubmitting`, `isLoading`, `isEditing`, `destroy$`.
  - Cung cấp sẵn các phương thức: `showSuccess()`, `showError()`, `showWarning()`, `showInfo()`, `confirm()`, `trackById()`.
- **Shared Components**:
  - `app-table`: Table đa năng generic `<T = any>` hỗ trợ Sticky header, Sticky columns trái/phải, Sort, Search, Filter, Pagination, Checkbox chọn nhiều (`selectable`), và custom template qua `[appTableCell]`.
  - `app-input`: Ô nhập văn bản kèm xóa nhanh (`clearable`).
  - `app-input-number`: Ô nhập số tiền kèm nút cộng/trừ, đã ẩn triệt để spin button mặc định của trình duyệt.
  - `app-select`: 3 chế độ (Single, Multi-select có tooltip thu gọn `+N`, Tagging nhập tag tùy ý).
  - `app-tree-select`: Chọn phòng ban/đơn vị theo cây thư mục.
  - `app-datepicker` & `app-date-range`: Popup lịch thiết kế đồng bộ chuẩn màu đỏ - đen LIVER.
  - `app-logo`: Logo chữ L hoạt họa bằng SVG Vector.

### 3. `layouts/` (Tầng bố cục)
- **`main-layout.component.ts`**:
  - Chứa thanh điều hướng Header, Breadcrumb tự động cập nhật theo URL.
  - Nút đóng/mở Sidebar ở trạng thái **`fixed`** nổi trên đường ranh giới sidebar (`left: 244px` khi mở, `left: 68px` khi thu gọn), icon đổi linh hoạt giữa `fa-chevron-left` và `fa-chevron-right`.
- **`sidebar.component.ts`**:
  - Đọc từ `MENU_ITEMS` để render động toàn bộ danh mục, hỗ trợ submenu đa cấp đóng/mở, badge "Hot", badge "New".

### 4. `features/` (Tầng nghiệp vụ)
- Mỗi tính năng là 1 folder độc lập trong `src/app/features/`, được cấu hình Lazy Loading tại `app.routes.ts`.
- Mọi component nghiệp vụ đều **kế thừa từ `BaseComponent`**.
- Sử dụng các control có sẵn từ `shared/components/` thay vì viết HTML thô.

---

## 🎨 HỆ MÀU CHỦ ĐẠO (LIVER THEME PALETTE)
| Tên biến CSS | Mã màu HEX | Mục đích sử dụng |
|---|---|---|
| `--liver-black` | `#0a0a0c` | Màu nền Sidebar, Header table, nút bấm chính |
| `--liver-dark` | `#141417` | Màu nền header logo, footer sidebar, card đậm |
| `--liver-panel` | `#1c1c21` | Màu panel giao diện, popover đậm |
| `--liver-red` | `#dc2626` | Màu nhấn chủ đạo (Primary Accent), nút hành động, viền active |
| `--liver-red-hover` | `#b91c1c` | Màu hover của nút đỏ |
| `--liver-red-light` | `#fef2f2` | Nền badge nhạt, highlight dòng bảng |
| `--liver-red-border` | `#fecaca` | Viền badge nhạt |

