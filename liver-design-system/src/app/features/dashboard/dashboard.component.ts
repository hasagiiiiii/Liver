import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ApiService, ProjectItem } from '../../core/services/api.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { InputNumberComponent } from '../../shared/components/input-number/input-number.component';
import { DatepickerComponent } from '../../shared/components/datepicker/datepicker.component';
import { DateRangeComponent } from '../../shared/components/date-range/date-range.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { TreeSelectComponent } from '../../shared/components/tree-select/tree-select.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { TableComponent, TableCellDirective } from '../../shared/components/table/table.component';
import { TableColumn, TableFilterOption } from '../../shared/components/table/table.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    InputNumberComponent,
    DatepickerComponent,
    DateRangeComponent,
    SelectComponent,
    TreeSelectComponent,
    TextareaComponent,
    TableComponent,
    TableCellDirective
  ],
  template: `
    <div class="space-y-6">
      <!-- ==================== BANNER SUMMARY ==================== -->
      <div class="bg-gradient-to-r from-liver-black via-liver-dark to-neutral-900 text-white rounded-2xl p-6 lg:p-8 shadow-xl border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="space-y-2 z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liver-red/20 border border-liver-red/40 text-liver-red text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-liver-red animate-ping"></span>
            <span>Enterprise Admin Portal</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-extrabold tracking-tight">
            LIVER Enterprise Design System
          </h1>
          <p class="text-xs lg:text-sm text-neutral-300 leading-relaxed">
            Tích hợp đầy đủ Text Input, Input Number, Datepicker, Date-Range, ng-Select (Single, Multi +N Tag, Tagging), Tree-Select, Text-Area và Sticky Sort Data Table chuẩn Tone Đen - Đỏ - Trắng.
          </p>
        </div>

        <div class="flex items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            (click)="submitFormValues()"
            class="px-4 py-2.5 rounded-lg bg-liver-red hover:bg-liver-redHover text-white text-xs font-bold transition-all shadow-lg shadow-liver-red/25 flex items-center gap-2"
          >
            <i class="fa-solid fa-floppy-disk"></i>
            <span>Lưu dữ liệu Form</span>
          </button>
          <button
            type="button"
            (click)="resetAllControls()"
            class="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all border border-neutral-700 flex items-center gap-2"
          >
            <i class="fa-solid fa-rotate"></i>
            <span>Khôi phục mặc định</span>
          </button>
        </div>

        <!-- Decorative background glow -->
        <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-liver-red/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- ==================== SECTION 1: FORM CONTROLS ==================== -->
      <div class="bg-white rounded-xl shadow-sm border border-neutral-200 hover:border-liver-redBorder/80 transition-colors overflow-visible" [formGroup]="liverForm">
        <!-- Section Header -->
        <div class="px-6 py-4 bg-liver-black text-white rounded-t-xl flex items-center justify-between border-b-2 border-liver-red">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-md bg-liver-red flex items-center justify-center text-xs">
              <i class="fa-solid fa-sliders"></i>
            </span>
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider">
                1. Hệ Thống Form Controls (Inputs, Select & Date)
              </h2>
            </div>
          </div>
          <span class="text-[11px] text-neutral-400">
            Tất cả control đều hỗ trợ tương tác trực tiếp & Two-Way Binding
          </span>
        </div>

        <!-- Controls Grid (3 Columns) -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 1. Text Input -->
          <app-input
            formControlName="projectName"
            label="1. Text Input"
            placeholder="Nhập tên dự án hoặc mã..."
            icon="fa-regular fa-user"
            [required]="true"
            hint="Hỗ trợ icon trái và nút xóa nhanh bên phải."
          ></app-input>

          <!-- 2. Input Number -->
          <app-input-number
            formControlName="budget"
            label="2. Input Number (Min: 0 - Step: 500,000)"
            [min]="0"
            [step]="500000"
            [required]="true"
            hint="Định dạng tiền tệ:"
          ></app-input-number>

          <!-- 3. Datepicker (Gõ ngày & Chọn Tháng / Năm) -->
          <div id="dateSection">
            <app-datepicker
              formControlName="singleDate"
              label="3. Datepicker (Gõ ngày / Chọn Tháng / Năm)"
              [required]="true"
              hint="Hỗ trợ gõ trực tiếp ngày DD/MM/YYYY, bấm Tháng/Năm trên header để đổi nhanh."
            ></app-datepicker>
          </div>

          <!-- 3.1. Datepicker Mode: Quarter Picker (Khi bật Quý) -->
          <div>
            <app-datepicker
              formControlName="reportingQuarter"
              [quarter]="true"
              label="3b. Datepicker (Chọn Quý - Khi bật Quarter)"
              [required]="true"
              hint="Khi bật [quarter]='true': chuyên biệt chọn Quý 1-4 & Năm, không còn chọn ngày tháng."
            ></app-datepicker>
          </div>

          <!-- 4. Date-Range Picker -->
          <app-date-range
            formControlName="dateRange"
            label="4. Date-Range (Khoảng thời gian)"
            [required]="true"
            hint="Lịch chọn khoảng thời gian đồng bộ giao diện với Datepicker."
          ></app-date-range>

          <!-- 5. Tree-Select -->
          <div id="treeSelectSection">
            <app-tree-select
              formControlName="department"
              [treeData]="treeDepartments"
              label="5. Tree-Select (Phân cấp phòng ban)"
              [required]="true"
              hint="Hỗ trợ mở rộng / thu gọn theo cây phân cấp cha - con."
            ></app-tree-select>
          </div>

          <!-- 6. Select - Single Mode -->
          <div id="selectSection">
            <app-select
              formControlName="approver"
              mode="single"
              [options]="approverOptions"
              label="6. Select - Single Select (Chọn 1 mục)"
              placeholder="Chọn người phê duyệt..."
              searchPlaceholder="Tìm người phê duyệt..."
              [required]="true"
              hint="Case Single Select: Chọn 1 giá trị, tìm kiếm & tự đóng."
            ></app-select>
          </div>

          <!-- 7. Select - Multiple Mode with +N Tag Overflow -->
          <div class="space-y-1.5">
            <app-select
              formControlName="technologies"
              mode="multiple"
              [options]="techMultiOptions"
              [maxVisibleTags]="2"
              label="7. Select - Multiple (Tràn ô hiện +N Tag)"
              placeholder="Chọn công nghệ..."
              [required]="true"
              hint="Khi các tag vượt quá chiều rộng ô select sẽ tự gom thành badge +N."
            ></app-select>
          </div>

          <!-- 8. Select - Tagging Mode ([addTag]="true") -->
          <div class="md:col-span-2 lg:col-span-2">
            <app-select
              formControlName="customTags"
              mode="none"
              [addTag]="true"
              label="8. Select - Tagging Mode ([addTag]=true - Tạo Tag mới & Trạng thái)"
              hint="Minh họa đầy đủ: Tag mặc định, Tag ưu tiên đỏ, Tag cố định (Locked) và tạo Tag tự do."
            ></app-select>
          </div>

          <!-- 9. Text-Area (Full Width across 3 columns) -->
          <div class="md:col-span-2 lg:col-span-3">
            <app-textarea
              formControlName="description"
              label="9. Text-Area (Ghi chú & Mô tả hệ thống)"
              placeholder="Nhập nội dung ghi chú chi tiết..."
              [rows]="3"
              [maxLength]="500"
              hint="Tích hợp bộ đếm ký tự trực quan và giới hạn ký tự nhập tối đa 500."
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- ==================== SECTION 2: DATA TABLE ==================== -->
      <app-table
        [columns]="tableColumns"
        [data]="tableRows"
        [loading]="isLoading"
        [title]="'2. Data Table (Sticky Header, Sticky Columns & Multi-Sort)'"
        [subtitle]="'Cố định cột Mã dự án (Trái) & Thao tác (Phải) khi cuộn ngang'"
        [filterOptions]="tableFilterOptions"
        filterKey="status"
        (onAdd)="addNewTableRowFromForm()"
      >
        <!-- Code Column Template -->
        <ng-template appTableCell="codeCol" let-row="row">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-liver-red"></span>
            <span class="font-extrabold text-liver-black">{{ row.code }}</span>
          </div>
        </ng-template>

        <!-- Department Column Template -->
        <ng-template appTableCell="departmentCol" let-row="row">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-liver-black font-medium">
            <i class="fa-solid fa-sitemap text-liver-red text-[10px]"></i>
            {{ row.department }}
          </span>
        </ng-template>

        <!-- Status Column Template -->
        <ng-template appTableCell="statusCol" let-row="row">
          <span
            [ngClass]="{
              'bg-neutral-900 text-white border-neutral-700': row.status === 'Active',
              'bg-liver-red text-white border-liver-redHover shadow-sm shadow-liver-red/25': row.status === 'Critical',
              'bg-liver-redLight text-liver-red border-liver-redBorder': row.status === 'Pending'
            }"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            {{ row.status }}
          </span>
        </ng-template>

        <!-- Actions Column Template -->
        <ng-template appTableCell="actionsCol" let-row="row">
          <div class="flex items-center justify-center gap-1.5">
            <button
              type="button"
              (click)="editTableRow(row)"
              class="w-7 h-7 rounded-md bg-neutral-900 hover:bg-liver-red text-white transition-colors flex items-center justify-center"
              title="Chỉnh sửa"
            >
              <i class="fa-solid fa-pen text-[10px]"></i>
            </button>
            <button
              type="button"
              (click)="deleteTableRow(row.code)"
              class="w-7 h-7 rounded-md border border-neutral-300 hover:border-liver-red hover:text-liver-red text-neutral-600 transition-colors flex items-center justify-center"
              title="Xóa"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
            </button>
          </div>
        </ng-template>
      </app-table>
    </div>
  `
})
export class DashboardComponent extends BaseComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);

  readonly approverOptions = this.apiService.approverOptions;
  readonly techMultiOptions = this.apiService.techMultiOptions;
  readonly treeDepartments = this.apiService.treeDepartments;

  readonly tableColumns: TableColumn<ProjectItem>[] = [
    {
      key: 'code',
      title: 'Mã Dự Án (Sticky L)',
      width: '160px',
      sortable: true,
      sticky: 'left',
      templateName: 'codeCol'
    },
    {
      key: 'name',
      title: 'Tên Dự Án / Nhân Sự',
      sortable: true
    },
    {
      key: 'department',
      title: 'Đơn Vị (Tree Node)',
      sortable: true,
      templateName: 'departmentCol'
    },
    {
      key: 'budget',
      title: 'Ngân Sách (VNĐ)',
      align: 'right',
      sortable: true,
      pipe: 'currency'
    },
    {
      key: 'date',
      title: 'Ngày Cập Nhật',
      sortable: true,
      pipe: 'date'
    },
    {
      key: 'status',
      title: 'Trạng Thái',
      sortable: true,
      templateName: 'statusCol'
    },
    {
      key: 'actions',
      title: 'Thao Tác (Sticky R)',
      width: '120px',
      align: 'center',
      sticky: 'right',
      templateName: 'actionsCol'
    }
  ];

  readonly tableFilterOptions: TableFilterOption[] = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Active (Đang chạy)', value: 'Active' },
    { label: 'Pending (Chờ duyệt)', value: 'Pending' },
    { label: 'Critical (Khẩn cấp)', value: 'Critical' }
  ];

  liverForm!: FormGroup;

  get tableRows(): ProjectItem[] {
    return this.apiService.projects();
  }

  private resetListener = () => {
    this.resetAllControls();
  };

  ngOnInit(): void {
    this.initForm();

    if (typeof window !== 'undefined') {
      window.addEventListener('liver:reset-controls', this.resetListener);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (typeof window !== 'undefined') {
      window.removeEventListener('liver:reset-controls', this.resetListener);
    }
  }

  initForm(): void {
    this.liverForm = this.fb.group({
      projectName: ['LIVER Enterprise Project', Validators.required],
      budget: [15500000, [Validators.required, Validators.min(0)]],
      singleDate: ['2026-10-24', Validators.required],
      reportingQuarter: ['2026-Q4', Validators.required],
      dateRange: [
        { startDate: '2026-10-01', endDate: '2026-10-24' },
        Validators.required
      ],
      department: ['Khối Công Nghệ > Đội Frontend Angular', Validators.required],
      approver: ['u1', Validators.required],
      technologies: [['ang', 'tw', 'rx', 'ts', 'nest'], Validators.required],
      customTags: [
        [
          { id: 't1', label: 'Core-System', type: 'locked' },
          { id: 't2', label: 'High-Priority', type: 'accent' },
          { id: 't3', label: 'Release-v2.4', type: 'default' }
        ]
      ],
      description: [
        'Giao diện quản trị LIVER thiết kế với tone màu Đen - Đỏ - Trắng chủ đạo. Bản quyền thuộc về dvant24102003@gmail.com.',
        Validators.maxLength(500)
      ]
    });
  }

  submitFormValues(): void {
    if (this.liverForm.invalid) {
      this.showWarning('Vui lòng kiểm tra lại các trường bắt buộc!');
      return;
    }

    const formVal = this.liverForm.value;
    const budgetFormatted = Number(formVal.budget).toLocaleString('vi-VN');
    const tagsCount = Array.isArray(formVal.technologies) ? formVal.technologies.length : 0;

    this.showSuccess(
      `Đã ghi nhận: "${formVal.projectName}" | Ngân sách: ${budgetFormatted} ₫ | (${tagsCount} tags)`
    );
  }

  resetAllControls(): void {
    this.liverForm.reset({
      projectName: 'LIVER Enterprise Project',
      budget: 15500000,
      singleDate: '2026-10-24',
      reportingQuarter: '2026-Q4',
      dateRange: { startDate: '2026-10-01', endDate: '2026-10-24' },
      department: 'Khối Công Nghệ > Đội Frontend Angular',
      approver: 'u1',
      technologies: ['ang', 'tw', 'rx', 'ts', 'nest'],
      customTags: [
        { id: 't1', label: 'Core-System', type: 'locked' },
        { id: 't2', label: 'High-Priority', type: 'accent' },
        { id: 't3', label: 'Release-v2.4', type: 'default' }
      ],
      description:
        'Giao diện quản trị LIVER thiết kế với tone màu Đen - Đỏ - Trắng chủ đạo. Bản quyền thuộc về dvant24102003@gmail.com.'
    });

    this.showInfo('Đã khôi phục giá trị mặc định cho toàn bộ Control!');
  }

  addNewTableRowFromForm(): void {
    const formVal = this.liverForm.value;
    const currentLength = this.tableRows.length;
    const nextNum = currentLength + 1;
    const newCode = `LVR-00${nextNum}`;

    const newProject: ProjectItem = {
      code: newCode,
      name: formVal.projectName || `Dự Án LIVER Mới #${nextNum}`,
      department: formVal.department.split(' > ').pop() || 'Đội Frontend Angular',
      budget: Number(formVal.budget) || 250000000,
      date: formVal.singleDate || '2026-10-24',
      status: 'Active'
    };

    this.apiService.addProject(newProject);
    this.showSuccess(`Đã thêm dòng mới (${newCode}) từ dữ liệu Control vào bảng!`);
  }

  editTableRow(row: ProjectItem): void {
    this.liverForm.patchValue({
      projectName: row.name,
      budget: row.budget,
      singleDate: row.date
    });
    this.showInfo(`Đang chỉnh sửa bản ghi ${row.code} trên Form Controls!`);
    // Smooth scroll to form section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteTableRow(code: string): Promise<void> {
    const confirmed = await this.confirm(`Bạn có chắc muốn xóa dự án ${code}?`, 'Xác nhận xóa');
    if (confirmed) {
      this.apiService.deleteProject(code);
      this.showWarning(`Đã xóa dự án ${code}`);
    }
  }
}
