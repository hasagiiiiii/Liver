# 🤖 QUY TẮC PHÁT TRIỂN & CHUẨN MỰC DÀNH CHO AI (SKILL.MD)

> **DỰ ÁN:** LIVER Design System (Angular 19+ Standalone, TailwindCSS, Theme Palette Dynamic Theming)  
> **ÁP DỤNG:** Tất cả các AI Agent, Developer, Subagent khi xử lý bất kỳ task, tính năng hoặc sửa lỗi nào trong codebase này.

---

## 📌 NGUYÊN TẮC VÀNG (GOLDEN RULES)

Khi nhận được yêu cầu phát triển mới hoặc chỉnh sửa chức năng, AI **BẮT BUỘC** phải tuân thủ 4 nguyên tắc sau:

1. **BẮT BUỘC DÙNG CONTROL CÓ SẴN:** Mọi form, bảng dữ liệu, bộ lọc, popup đều phải tái sử dụng các control trong thư mục `src/app/shared/components/`. **TUYỆT ĐỐI KHÔNG** tự viết thẻ `<table>`, `<input>`, `<select>`, `<datepicker>` thuần bằng HTML với style chắp vá.
2. **BẮT BUỘC KẾ THỪA `BaseComponent`:** Mọi file Component `.ts` mới được sinh ra (Feature Component, View Component, Modal Component...) **BẮT BUỘC** phải `extends BaseComponent`.
3. **BẮT BUỘC DÙNG SERVICE & BIẾN TẬP TRUNG TỪ BASE:** Tận dụng các biến và service đã được inject sẵn trong `BaseComponent` (`this.toast`, `this.modal`, `this.router`, `this.route`, `this.fb`, `this.isLoading`, `this.isSubmitting`, `this.destroy$`, `this.showSuccess()`, `this.showError()`, `this.confirm()`). Không inject lại thủ công gây trùng lặp.
4. **BẮT BUỘC DÙNG THEME PALETTE VARIABLES CHO MÀU SẮC, BORDER & SHADOW:** Tuyệt đối **KHÔNG** hardcode mã màu hex (`#dc2626`, `#b91c1c`, v.v.), class màu cố định (`bg-red-50`, `border-red-200`), hay class bóng cố định (`shadow-red-600/30`, `focus:ring-red-500/20`). Toàn bộ màu nền, chữ, đường viền (border) và hiệu ứng đổ bóng (shadow) đều phải sử dụng semantic tokens / CSS variables (`bg-liver-red`, `hover:bg-liver-redHover`, `text-liver-red`, `border-liver-red`, `border-liver-redBorder`, `hover:border-liver-red/60`, `shadow-liver-red/25`, `focus:ring-liver-red/20`, SVG `var(--liver-red)`) để toàn bộ giao diện tự động thích ứng ngay lập tức khi đổi bảng màu Theme Palette.

---

## 🏗️ 1. QUY CHUẨN KẾ THỪA `BaseComponent`

### 1.1. Đường dẫn file BaseComponent
- **File:** `src/app/shared/components/base/base.component.ts` (export qua `src/app/shared/components/base/index.ts`)

### 1.2. Danh sách Services và Biến đã được inject sẵn trong BaseComponent

| Tên biến / Service | Kiểu dữ liệu | Mô tả & Cách sử dụng |
| :--- | :--- | :--- |
| `this.toast` / `this.notificationService` | `ToastService` | Service hiển thị thông báo góc màn hình |
| `this.modal` | `ModalService` | Service mở hộp thoại xác nhận (Confirm Modal) |
| `this.router` | `Router` | Điều hướng trang (`this.router.navigate(...)`) |
| `this.route` | `ActivatedRoute` | Đọc queryParams, route params |
| `this.fb` | `FormBuilder` | Khởi tạo Reactive Form |
| `this.destroyRef` | `DestroyRef` | Tự động hủy subscription qua `takeUntilDestroyed(this.destroyRef)` |
| `this.destroy$` | `Subject<void>` | Subject dùng cho RxJS `takeUntil(this.destroy$)`, tự complete tại `ngOnDestroy()` |
| `this.isLoading` | `boolean` | Cờ trạng thái tải dữ liệu màn hình |
| `this.isSubmitting` | `boolean` | Cờ trạng thái đang submit form (chặn double-click) |
| `this.isEditing` | `boolean` | Cờ phân biệt tạo mới (`false`) hay cập nhật (`true`) |
| `this.loading` | `WritableSignal<boolean>` | Signal loading dành cho template Reactive Signals |

### 1.3. Các hàm Helper có sẵn trong BaseComponent

```typescript
// 1. Hiển thị thông báo Toast
this.showSuccess('Thêm mới thành công!');
this.showError('Có lỗi xảy ra khi lưu dữ liệu!');
this.showWarning('Vui lòng kiểm tra lại thông tin!');
this.showInfo('Dữ liệu đã được đồng bộ');

// 2. Mở hộp thoại xác nhận (trả về Promise<boolean>)
const ok = await this.confirm('Bạn có chắc muốn xoá bản ghi này?', 'Xác nhận xoá');
if (ok) {
  // Thực hiện xoá...
}

// 3. Hàm trackBy tối ưu cho ngFor / @for
// Dùng trực tiếp trong template: track: trackById
```

### 1.4. Template chuẩn cho một Component mới kế thừa BaseComponent

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../shared/components/base/base.component';

// Import các Shared Controls
import { TableComponent } from '../../shared/components/table/table.component';
import { TableCellDirective } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.interface';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { DatepickerComponent } from '../../shared/components/datepicker/datepicker.component';

@Component({
  selector: 'app-sample-feature',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    TableCellDirective,
    InputComponent,
    SelectComponent,
    DatepickerComponent
  ],
  templateUrl: './sample-feature.component.html',
  styleUrls: ['./sample-feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleFeatureComponent extends BaseComponent implements OnInit {
  // KHÔNG CẦN inject lại ToastService, ModalService, FormBuilder, Router
  // Chúng đã có sẵn từ BaseComponent qua `this.toast`, `this.modal`, `this.fb`, `this.router`

  readonly form = this.fb.group({
    search: [''],
    status: ['all'],
    date: [null]
  });

  columns: TableColumn[] = [
    { key: 'code', title: 'MÃ ĐƠN', sortable: true, width: '120px' },
    { key: 'name', title: 'TÊN KHÁCH HÀNG', sortable: true },
    { key: 'actions', title: 'THAO TÁC', align: 'center', width: '110px' }
  ];

  data: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      // Mock hoặc gọi API
      this.data = [];
    } catch (err) {
      this.showError('Không thể tải dữ liệu');
    } finally {
      this.isLoading = false;
    }
  }

  async onDelete(item: any): Promise<void> {
    const confirmed = await this.confirm(`Bạn có chắc muốn xoá "${item.name}"?`);
    if (confirmed) {
      this.showSuccess('Đã xoá thành công!');
      this.loadData();
    }
  }
}
```

---

## 🎛️ 2. DANH MỤC CÁC CONTROL TRONG `src/app/shared/components/`

Mọi AI khi xây dựng màn hình hoặc chức năng đều **BẮT BUỘC** sử dụng các control dưới đây:

### 2.1. Common Table (`app-table`)
- **Import:** `TableComponent`, `TableCellDirective` từ `src/app/shared/components/table/table.component`
- **Interface:** `TableColumn`, `TableSortState`, `TableAction` từ `src/app/shared/components/table/table.interface`
- **Tính năng có sẵn:**
  - Checkbox chọn dòng (hàng loạt hoặc từng dòng), emit `(selectedRowsChange)`.
  - Phân trang động (pagination), nút trang active có `border-liver-red bg-liver-red text-white shadow-md shadow-liver-red/25`.
  - Tìm kiếm nhanh toàn bảng.
  - Sắp xếp (sorting) click header.
  - Trạng thái Loading spinner nổi chuẩn theme.
  - Sticky header, sticky left/right cột.
  - Custom cell template thông qua `appTableCell="tên_cột"`.
- **Cách dùng:**
```html
<app-table
  [columns]="columns"
  [data]="users"
  [loading]="isLoading"
  [selectable]="true"
  [searchable]="true"
  [pageSize]="10"
  [pageSizeOptions]="[5, 10, 20, 50]"
  (selectedRowsChange)="onSelectionChange($event)"
  (sortChange)="onSortChange($event)">

  <!-- Custom Cell cho Cột 'status' -->
  <ng-template appTableCell="status" let-row let-value="value">
    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          [ngClass]="value === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-liver-redLight text-liver-red border border-liver-redBorder'">
      {{ value === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa' }}
    </span>
  </ng-template>

  <!-- Custom Cell cho Cột 'actions' -->
  <ng-template appTableCell="actions" let-row>
    <div class="flex items-center justify-center gap-1.5">
      <button (click)="openEditModal(row)" class="p-1 text-neutral-400 hover:text-liver-black rounded">
        <i class="fas fa-pen text-xs"></i>
      </button>
      <button (click)="deleteItem(row)" class="p-1 text-liver-red hover:text-liver-redHover rounded">
        <i class="fas fa-trash text-xs"></i>
      </button>
    </div>
  </ng-template>
</app-table>
```

---

### 2.2. Text Input (`app-input`)
- **Import:** `InputComponent` từ `src/app/shared/components/input/input.component`
- **Border & Shadow Rules:**
  - Viền nghỉ: `border-neutral-300`
  - Viền hover: `hover:border-liver-red/60`
  - Viền focus: `focus:border-liver-red focus:ring-2 focus:ring-liver-red/20`
  - Viền lỗi: `border-liver-red bg-liver-redLight/30`
- **Cách dùng:**
```html
<app-input
  label="Tên đăng nhập"
  placeholder="Nhập tên đăng nhập..."
  formControlName="username"
  [prefixIcon]="'fa-user'"
  [clearable]="true"
  [required]="true"
  [error]="form.get('username')?.touched && form.get('username')?.invalid ? 'Tên đăng nhập là bắt buộc' : ''">
</app-input>
```

---

### 2.3. Number Input (`app-input-number`)
- **Import:** `InputNumberComponent` từ `src/app/shared/components/input-number/input-number.component`
- **Border & Shadow Rules:**
  - Nút +/-: `bg-liver-black hover:bg-liver-red border border-liver-black hover:border-liver-redHover text-white`
  - Input giữa: `border-y border-neutral-300 hover:border-liver-red/60 focus:border-liver-red focus:ring-1 focus:ring-liver-red/20`
- **Cách dùng:**
```html
<app-input-number
  label="Số lượng"
  placeholder="Nhập số..."
  formControlName="quantity"
  [min]="1"
  [max]="1000"
  [step]="1">
</app-input-number>
```

---

### 2.4. Dropdown Select (`app-select`)
- **Import:** `SelectComponent` từ `src/app/shared/components/select/select.component`
- **Border & Shadow Rules:**
  - Khung trigger: `border-neutral-300 hover:border-liver-red/60` (khi mở `[class.border-liver-red]="isOpen"`)
  - Menu Dropdown: `border border-neutral-200 hover:border-liver-redBorder/80 shadow-2xl`
  - Option check: `border-neutral-200 hover:border-liver-red/60`
- **Cách dùng:**
```html
<app-select
  label="Vai trò (Role)"
  placeholder="-- Chọn vai trò --"
  formControlName="role"
  [options]="[
    { label: 'Quản trị viên (ADMIN)', value: 'ADMIN' },
    { label: 'Điều hành viên (MOD)', value: 'MOD' },
    { label: 'Nhân viên (USER)', value: 'USER' }
  ]"
  [searchable]="true"
  [multiple]="false">
</app-select>
```

---

### 2.5. Dropdown Phân Cấp Cây (`app-tree-select`)
- **Import:** `TreeSelectComponent` từ `src/app/shared/components/tree-select/tree-select.component`
- **Border & Shadow Rules:**
  - Khung trigger: `border-neutral-300 hover:border-liver-red/60` (khi mở `[class.border-liver-red]="isOpen"`)
  - Dropdown menu: `border border-neutral-200 hover:border-liver-redBorder/80 shadow-2xl`
  - Active node: `bg-liver-red text-white font-bold`
- **Cách dùng:**
```html
<app-tree-select
  label="Phòng ban"
  placeholder="Chọn phòng ban trực thuộc..."
  formControlName="departmentId"
  [nodes]="treeNodes">
</app-tree-select>
```

---

### 2.6. Datepicker (`app-datepicker`)
- **Import:** `DatepickerComponent` từ `src/app/shared/components/datepicker/datepicker.component`
- **Tính năng cao cấp:**
  - **Gõ trực tiếp ngày:** Hỗ trợ nhập tay qua input `DD/MM/YYYY`, tự động validate & sync lịch hai chiều.
  - **Đa chế độ (Mode):** Hỗ trợ `mode="date" | "month" | "quarter" | "year"`.
  - **Điều hướng Tháng & Năm trực tiếp:** Bấm vào "Tháng XX" trên header để mở grid 12 tháng, bấm vào "Năm YYYY" để mở grid thập kỷ 12 năm.
  - **Nguyên tắc tách biệt Quý & Ngày/Tháng (BẮT BUỘC):**
    - **Mặc định (`mode="date"`):** Chỉ chọn ngày tháng năm, **TUYỆT ĐỐI KHÔNG** hiển thị tuỳ chọn Quý.
    - **Khi bật Quý (`[quarter]="true"` hoặc `mode="quarter"`):** Chuyên biệt chọn Quý (`Quý 1, 2, 3, 4` kèm Năm, định dạng `YYYY-QX`), **ĐÃ CHỌN QUÝ SẼ KHÔNG CÒN CHỌN NGÀY THÁNG NỮA**. Đổi năm xong sẽ quay trực tiếp về màn Quý.
  - **Tự động đóng khi click ra ngoài** nhờ `ClickOutsideDirective`.
- **Border & Shadow Rules:**
  - Khung input: `border-neutral-300 hover:border-liver-red/60 focus-within:border-liver-red focus-within:ring-2 focus-within:ring-liver-red/20` (khi mở `[class.border-liver-red]="isOpen"`)
  - Calendar Popup: `border border-neutral-200 hover:border-liver-redBorder/80 shadow-2xl`
  - Ngày / Tháng / Năm / Quý được chọn: `bg-liver-red text-white font-bold shadow-md shadow-liver-red/25`
- **Cách dùng:**
```html
<!-- 1. Chọn ngày tiêu chuẩn (cho phép gõ trực tiếp & chọn Tháng/Năm, không có Quý) -->
<app-datepicker
  label="Ngày bắt đầu"
  formControlName="startDate"
  [clearable]="true">
</app-datepicker>

<!-- 2. Chọn Quý chuyên dụng (Khi bật quarter: không còn chọn ngày tháng) -->
<app-datepicker
  label="Kỳ báo cáo"
  [quarter]="true"
  formControlName="quarterPeriod"
  [clearable]="true">
</app-datepicker>

<!-- 3. Chọn Tháng chuyên dụng (Month Picker: 2026-11) -->
<app-datepicker
  label="Tháng hạch toán"
  mode="month"
  formControlName="accountingMonth"
  [clearable]="true">
</app-datepicker>
```

---

### 2.7. Date Range Picker (`app-date-range`)
- **Import:** `DateRangeComponent` từ `src/app/shared/components/date-range/date-range.component`
- **Border & Shadow Rules:**
  - Khung trigger: `border-neutral-300 hover:border-liver-red/60` (khi mở `[class.border-liver-red]="isOpen"`)
  - Calendar Popup: `border border-neutral-200 hover:border-liver-redBorder/80 shadow-2xl`
  - Start/End date: `bg-liver-red text-white shadow-md shadow-liver-red/25`
  - In-between range: `bg-liver-redLight text-liver-red font-medium`
- **Cách dùng:**
```html
<app-date-range
  label="Thời gian lọc"
  formControlName="dateRange">
</app-date-range>
```

---

### 2.8. Textarea (`app-textarea`)
- **Import:** `TextareaComponent` từ `src/app/shared/components/textarea/textarea.component`
- **Border & Shadow Rules:**
  - Viền: `border-neutral-300 hover:border-liver-red/60 focus:border-liver-red focus:ring-2 focus:ring-liver-red/20`
- **Cách dùng:**
```html
<app-textarea
  label="Ghi chú"
  placeholder="Nhập ghi chú chi tiết..."
  formControlName="note"
  [rows]="3"
  [maxLength]="500">
</app-textarea>
```

---

### 2.9. Animated SVG Logo (`app-logo`)
- **Import:** `LogoComponent` từ `src/app/shared/components/logo/logo.component`
- **Border & Shadow Rules:**
  - Container Logo: `border border-liver-red/40 group-hover:border-liver-red shadow-lg shadow-liver-red/25 group-hover:shadow-liver-red/50`
  - Laser Beam & Neon Filter: ánh sáng nền và gradient dùng biến `var(--liver-red)`, `var(--liver-red-hover)`, `var(--liver-red-light)`
  - SVG Keyframe drop-shadow: `filter: drop-shadow(0 4px 12px var(--liver-red))` và `filter: drop-shadow(0 0 8px var(--liver-red))`
- **Cách dùng:**
```html
<app-logo [size]="42" [showText]="true"></app-logo>
```

---

## 🎨 3. QUY CHUẨN THEME PALETTE & CSS VARIABLES

Hệ thống hỗ trợ 5 bộ Theme Palette chuyển đổi thời gian thực:
1. **Crimson Red (Mặc định):** Đỏ thể thao mạnh mẽ (`#dc2626`)
2. **Gold (Hoàng Kim):** Vàng cam sang trọng (`#d97706`)
3. **Emerald (Ngọc Lục Bảo):** Xanh lá công nghệ tươi mới (`#059669`)
4. **Cobalt (Lam Đậm):** Xanh dương hiện đại chuẩn doanh nghiệp (`#2563eb`)
5. **Violet (Tím Huyền Bí):** Tím tương lai Cyberpunk (`#7c3aed`)

### 3.1. Bảng ánh xạ CSS Variables sang Tailwind Utility Classes

| CSS Variable | Tailwind Utility Token | Mục đích sử dụng |
| :--- | :--- | :--- |
| `var(--liver-red)` | `bg-liver-red`, `text-liver-red`, `border-liver-red`, `accent-liver-red` | Màu chủ đạo (Primary Accent), Nút chính, Active Tab, Checkbox |
| `var(--liver-red-hover)` | `hover:bg-liver-redHover`, `hover:text-liver-redHover` | Màu hover cho nút chính, icon click |
| `var(--liver-red-light)` | `bg-liver-redLight` | Nền nhạt cho tag, badge, dải chọn ngày, hover dòng bảng |
| `var(--liver-red-border)` | `border-liver-redBorder` | Viền nhạt ăn khớp với nền nhạt cho badge, popup, dropdown hover |
| `var(--liver-black)` | `bg-liver-black`, `text-liver-black` | Màu đen sâu tiêu chuẩn cho text chính, header |
| `var(--liver-dark)` | `bg-liver-dark` | Màu nền Sidebar, Header bar, Footer dark |
| `var(--liver-panel)` | `bg-liver-panel` | Màu nền card panel bề mặt |

### 3.2. Quy tắc áp dụng cho Button & Input
- **Primary Button:** `bg-liver-red hover:bg-liver-redHover text-white shadow-md shadow-liver-red/25`
- **Secondary / Outline Button:** `border border-neutral-300 hover:border-liver-red hover:text-liver-red`
- **Input Focus State:** `hover:border-liver-red/60 focus:border-liver-red focus:ring-2 focus:ring-liver-red/20`
- **Input Error State:** `border-liver-red text-liver-red bg-liver-redLight/30`
- **Badge / Pill Accent:** `bg-liver-redLight text-liver-red border border-liver-redBorder`
- **Table Selected Row:** `bg-liver-redLight/40 hover:bg-liver-redLight/60`

### 3.3. Quy chuẩn Shadow (Đổ bóng & Ánh sáng động)
- Mọi hiệu ứng đổ bóng làm nổi bật thành phần phải sử dụng biến chủ đạo của palette:
  - Nút bấm chính & CTA: `shadow-md shadow-liver-red/25` (hover: `hover:shadow-liver-red/40`)
  - Nút nổi cố định (Floating Switcher, Sidebar Toggle): `shadow-xl shadow-liver-red/35 hover:shadow-liver-red/50`
  - Logo Container: `shadow-lg shadow-liver-red/25 group-hover:shadow-liver-red/50`
  - Logo SVG Glow Keyframe: `filter: drop-shadow(0 4px 12px var(--liver-red))`
  - Modals / Popups xác nhận: `shadow-2xl shadow-liver-red/15`

### 3.4. Quy chuẩn Border (Đường viền của các Component)
- Tất cả các control form, card, popup, modal đều phải phản ánh border theo Theme Palette:
  - Khung nhập liệu ở trạng thái hover: luôn dùng `hover:border-liver-red/60` (thay vì `hover:border-liver-black` hay `hover:border-neutral-400`).
  - Khung nhập liệu khi mở Dropdown hoặc Focus: `focus:border-liver-red` hoặc `[class.border-liver-red]="isOpen"`.
  - Khung bao ngoài của Card, Table, Modal: `border border-neutral-200 hover:border-liver-redBorder/80 transition-colors`.
  - Phân trang bảng (Pagination) trang đang chọn: `border-liver-red bg-liver-red text-white shadow-md shadow-liver-red/25`.

---

## 🚫 4. CÁC ĐIỀU CẤM KỴ (ANTI-PATTERNS CẦN TRÁNH)

1. ❌ **CẤM HARDCODE MÃ MÀU & SHADOW (ZERO HARDCODED COLORS/SHADOWS):**
   - **Tuyệt đối không** dùng `#dc2626`, `#b91c1c`, `#fef2f2`, `#fecaca` trong component hoặc CSS.
   - **Tuyệt đối không** dùng các class cố định như `bg-red-50`, `bg-red-100`, `border-red-200`, `shadow-red-600/30`, `focus:ring-red-500/20`.
   - **Tuyệt đối không** dùng hardcode shadow đỏ `shadow-red-*` hoặc SVG `drop-shadow(rgba(220, 38, 38, ...))` - bắt buộc dùng `shadow-liver-red/*` và `var(--liver-red)`.
2. ❌ **CẤM BỎ QUÊN BORDER & SHADOW THEME TRÊN CONTROLS:**
   - Không được để border ở trạng thái hover màu đen `hover:border-liver-black` gây mất tính đồng bộ với theme đang chọn. Phải dùng `hover:border-liver-red/60`.
   - Logo component không được để shadow đen `shadow-liver-dark` hay viền trung tính `border-neutral-700` khi bình thường. Bắt buộc có hào quang theme `shadow-liver-red/25` và `border-liver-red/40`.
3. ❌ **CẤM HARDCODE MENU & DỮ LIỆU BẢNG:**
   - Không fix cứng danh sách menu trong template. Menu khai báo duy nhất tại `src/app/core/constants/menu.constant.ts`.
   - Không tự viết thẻ `<td>` cho bảng dữ liệu. Bắt buộc dùng `TableColumn` và `data` thông qua `app-table`.
4. ❌ **CẤM TỰ VIẾT HTML FORM CONTROLS TRẦN:**
   - Không dùng `<input>`, `<select>` trần. Bắt buộc dùng `app-input`, `app-input-number`, `app-select`, `app-datepicker`.
5. ❌ **CẤM INJECT LẠI CÁC DỊCH VỤ ĐÃ CÓ TRONG BASE:**
   - Đã `extends BaseComponent` thì không inject lại `ToastService`, `ModalService`, `FormBuilder`, `Router`.
6. ❌ **CẤM QUÊN HỦY SUBSCRIPTION:**
   - Mọi RxJS `subscribe` trong component phải được gán `.pipe(takeUntil(this.destroy$))` hoặc dùng Angular `takeUntilDestroyed(this.destroyRef)`.
7. ❌ **CẤM LÀM LỖI TEST & BUILD:**
   - Trước khi hoàn tất turn, luôn đảm bảo `npx ng test --watch=false` pass 100% và `ng build` không có cảnh báo compile error.

---

## ✅ 5. CHECKLIST TỰ KIỂM TRA CHO AI (SELF-VERIFICATION)

Mỗi khi AI hoàn thành code cho người dùng, hãy tự rà soát:
- [ ] Component mới đã có `extends BaseComponent` chưa?
- [ ] Các form input đã sử dụng `app-input`, `app-input-number`, `app-select`, `app-datepicker` chưa?
- [ ] Bảng dữ liệu đã sử dụng `app-table` với interface `TableColumn[]` chưa?
- [ ] Toàn bộ màu sắc, button, input, badge đã dùng semantic theme tokens (`liver-red`, `liver-redLight`, `liver-redBorder`, v.v.), không còn mã màu tự điền hardcode?
- [ ] Phần shadow (đổ bóng) của Logo, Button, Card, Floating Switcher đã dùng `shadow-liver-red/*` và `var(--liver-red)` chưa?
- [ ] Phần border của các component (Input hover, Select dropdown, Modal, Card, Table) đã áp dụng `hover:border-liver-red/60`, `focus:border-liver-red`, `border-liver-redBorder` theo Theme Palette chưa?
- [ ] Các thao tác thông báo thành công / thất bại đã dùng `this.showSuccess()` / `this.showError()` chưa?
- [ ] Các thao tác xoá / hành động nguy hiểm đã dùng `await this.confirm()` chưa?
- [ ] Đã chạy test `npx ng test --watch=false` và build `npm run build` thành công chưa?
