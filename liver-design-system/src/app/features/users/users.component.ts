import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { TableComponent, TableCellDirective } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.interface';
import { UserService, User, UserRole, UserStatus } from '../../core/services/user.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TableComponent,
    TableCellDirective,
    InputComponent,
    SelectComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- ==================== HEADER & KPI METRICS ==================== -->
      <div class="bg-gradient-to-r from-liver-black via-liver-dark to-neutral-900 text-white rounded-2xl p-6 lg:p-8 shadow-xl border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="space-y-2 z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liver-red/20 border border-liver-red/40 text-liver-red text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-liver-red animate-ping"></span>
            <span>Hệ Thống Phân Quyền & Nhân Sự</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Quản Lý Người Dùng (User Management)
          </h1>
          <p class="text-xs lg:text-sm text-neutral-400 leading-relaxed">
            Danh sách nhân viên, thông tin tài khoản, phân quyền vai trò, liên hệ và trạng thái hoạt động với thao tác thêm mới, chỉnh sửa và xóa hàng loạt.
          </p>
        </div>

        <div class="flex items-center gap-3 z-10">
          <button
            type="button"
            (click)="openAddModal()"
            class="px-4 py-2.5 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-liver-red/25 transition-all hover:scale-105"
          >
            <i class="fa-solid fa-user-plus"></i>
            <span>Thêm Người Dùng</span>
          </button>
        </div>

        <!-- Ambient Red Decorative Pattern -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-liver-red/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- Quick KPI Counters Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- KPI 1: Tổng người dùng -->
        <div class="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Tổng nhân sự</p>
            <p class="text-2xl font-black text-liver-black mt-1">{{ totalUsersCount }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-neutral-100 text-liver-black flex items-center justify-center text-sm">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>

        <!-- KPI 2: Đang hoạt động -->
        <div class="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Đang hoạt động</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">{{ activeUsersCount }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
            <i class="fa-solid fa-user-check"></i>
          </div>
        </div>

        <!-- KPI 3: Tạm ngừng / Đã khóa -->
        <div class="p-4 rounded-xl bg-white border border-neutral-200 hover:border-liver-red/50 hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Tạm khóa / Ngừng</p>
            <p class="text-2xl font-black text-liver-red mt-1">{{ lockedOrInactiveCount }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-liver-redLight text-liver-red border border-liver-redBorder flex items-center justify-center text-sm">
            <i class="fa-solid fa-user-slash"></i>
          </div>
        </div>

        <!-- KPI 4: Đã chọn để thao tác -->
        <div
          [class.border-liver-red]="selectedUsers.length > 0"
          [class.shadow-md]="selectedUsers.length > 0"
          [class.shadow-liver-red/20]="selectedUsers.length > 0"
          class="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between transition-all"
        >
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Đang chọn</p>
            <p class="text-2xl font-black text-liver-black mt-1">
              <span [class.text-liver-red]="selectedUsers.length > 0">{{ selectedUsers.length }}</span>
              <span class="text-xs font-medium text-neutral-400"> / {{ usersList.length }}</span>
            </p>
          </div>
          <div
            [class.bg-liver-red]="selectedUsers.length > 0"
            [class.text-white]="selectedUsers.length > 0"
            [class.bg-neutral-100]="selectedUsers.length === 0"
            [class.text-neutral-400]="selectedUsers.length === 0"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-colors"
          >
            <i class="fa-solid fa-list-check"></i>
          </div>
        </div>
      </div>

      <!-- ==================== VÙNG CARD FILTER ==================== -->
      <div class="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-liver-redBorder/80 transition-colors shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-filter text-liver-red text-sm"></i>
            <span class="text-xs font-bold uppercase tracking-wider text-liver-black">Bộ Lọc & Tìm Kiếm Nhân Sự</span>
          </div>

          @if (isFiltered) {
            <span class="text-[11px] font-semibold text-liver-red bg-liver-redLight px-2 py-0.5 rounded-full border border-liver-redBorder">
              Đang áp dụng bộ lọc
            </span>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <!-- Filter 1: Từ khóa tìm kiếm (app-input) -->
          <div>
            <app-input
              label="Từ khóa tìm kiếm"
              placeholder="Tìm MNV, tên, email, SDT..."
              icon="fa-solid fa-magnifying-glass"
              [(ngModel)]="filterKeyword"
              (ngModelChange)="applyFilter()"
            ></app-input>
          </div>

          <!-- Filter 2: Vai trò (Role) (app-select) -->
          <div>
            <app-select
              label="Vai trò / Chức vụ"
              placeholder="Tất cả vai trò"
              [(ngModel)]="filterRole"
              (ngModelChange)="applyFilter()"
              [options]="roleFilterOptions"
              mode="single"
            ></app-select>
          </div>

          <!-- Filter 3: Trạng thái hoạt động (app-select) -->
          <div>
            <app-select
              label="Trạng thái hoạt động"
              placeholder="Tất cả trạng thái"
              [(ngModel)]="filterStatus"
              (ngModelChange)="applyFilter()"
              [options]="statusFilterOptions"
              mode="single"
            ></app-select>
          </div>

          <!-- Action Buttons in Filter -->
          <div class="flex items-center gap-2 pb-1.5">
            <button
              type="button"
              (click)="resetFilters()"
              class="flex-1 h-[42px] px-3 rounded-lg border border-neutral-300 hover:border-liver-red hover:text-liver-red text-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Đặt lại bộ lọc"
            >
              <i class="fa-solid fa-arrow-rotate-left"></i>
              <span>Đặt lại</span>
            </button>

            <!-- Delete Multiple Button (Active when selected > 0) -->
            @if (selectedUsers.length > 0) {
              <button
                type="button"
                (click)="openBatchDeleteModal()"
                class="flex-1 h-[42px] px-3 rounded-lg bg-liver-red hover:bg-liver-redHover text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-liver-red/25 animate-pulse"
                title="Xóa các mục đã chọn"
              >
                <i class="fa-solid fa-trash-can"></i>
                <span>Xóa ({{ selectedUsers.length }})</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- ==================== TABLE DANH SÁCH NGƯỜI DÙNG ==================== -->
      <app-table
        [columns]="tableColumns"
        [data]="usersListWithIndex"
        [loading]="isLoading"
        [title]="'Danh Sách Người Dùng'"
        [subtitle]="'Quản lý chi tiết danh sách tài khoản, thông tin liên hệ và trạng thái hoạt động'"
        [showHeader]="true"
        [showAddButton]="true"
        addButtonText="Thêm người dùng"
        (onAdd)="openAddModal()"
        [selectable]="true"
        [selectedRows]="selectedUsers"
        (selectionChange)="onSelectionChange($event)"
        [enableSearch]="false"
        [showPagination]="true"
        [pageSize]="8"
        maxHeight="480px"
        minWidth="1200px"
      >
        <!-- STT Column Template -->
        <ng-template appTableCell="sttCol" let-row="row" let-index="index">
          <span class="font-bold text-neutral-500">{{ row.stt }}</span>
        </ng-template>

        <!-- MNV Column Template -->
        <ng-template appTableCell="mnvCol" let-row="row">
          <span class="px-2 py-1 rounded bg-neutral-100 font-extrabold text-liver-black text-xs border border-neutral-200">
            {{ row.mnv }}
          </span>
        </ng-template>

        <!-- Username & Avatar Info Column Template -->
        <ng-template appTableCell="userCol" let-row="row">
          <div class="flex items-center gap-3">
            <!-- Avatar with Initials -->
            <div
              [style.backgroundColor]="row.avatarBg || 'var(--liver-red)'"
              class="w-8 h-8 rounded-full text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm"
            >
              {{ row.avatar }}
            </div>
            <div class="truncate">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-liver-black">{{ row.fullName }}</span>
                <span class="text-[10px] text-neutral-400">(&#64;{{ row.username }})</span>
              </div>
              <p class="text-[11px] text-neutral-500 truncate">{{ row.email }}</p>
            </div>
          </div>
        </ng-template>

        <!-- Role Badge Column Template -->
        <ng-template appTableCell="roleCol" let-row="row">
          <span
            [ngClass]="getRoleBadgeClass(row.role)"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
          >
            <i [class]="getRoleIcon(row.role)"></i>
            <span>{{ row.role }}</span>
          </span>
        </ng-template>

        <!-- Phone Column Template -->
        <ng-template appTableCell="phoneCol" let-row="row">
          <span class="inline-flex items-center gap-1.5 font-medium text-neutral-700">
            <i class="fa-solid fa-phone text-liver-red text-[10px]"></i>
            <span>{{ row.phone }}</span>
          </span>
        </ng-template>

        <!-- Status Column Template -->
        <ng-template appTableCell="statusCol" let-row="row">
          <span
            [ngClass]="{
              'bg-emerald-50 text-emerald-700 border-emerald-200': row.status === 'ACTIVE',
              'bg-neutral-100 text-neutral-600 border-neutral-200': row.status === 'INACTIVE',
              'bg-liver-redLight text-liver-red border-liver-redBorder': row.status === 'LOCKED'
            }"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
          >
            <span
              [ngClass]="{
                'bg-emerald-500 animate-pulse': row.status === 'ACTIVE',
                'bg-neutral-400': row.status === 'INACTIVE',
                'bg-liver-red': row.status === 'LOCKED'
              }"
              class="w-1.5 h-1.5 rounded-full"
            ></span>
            <span>{{ getStatusLabel(row.status) }}</span>
          </span>
        </ng-template>

        <!-- Created Date Template -->
        <ng-template appTableCell="createdCol" let-row="row">
          <span class="text-neutral-500 text-[11px]">{{ row.createdAt }}</span>
        </ng-template>

        <!-- Updated Date Template -->
        <ng-template appTableCell="updatedCol" let-row="row">
          <span class="text-neutral-500 text-[11px]">{{ row.updatedAt }}</span>
        </ng-template>

        <!-- Actions Column Template -->
        <ng-template appTableCell="actionsCol" let-row="row">
          <div class="flex items-center justify-center gap-1.5">
            <button
              type="button"
              (click)="openEditModal(row)"
              class="w-7 h-7 rounded-md bg-neutral-900 hover:bg-liver-red text-white transition-colors flex items-center justify-center shadow-sm"
              title="Chỉnh sửa thông tin"
            >
              <i class="fa-solid fa-pen text-[10px]"></i>
            </button>
            <button
              type="button"
              (click)="openSingleDeleteModal(row)"
              class="w-7 h-7 rounded-md border border-neutral-300 hover:border-liver-red hover:text-liver-red text-neutral-600 transition-colors flex items-center justify-center"
              title="Xóa người dùng"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
            </button>
          </div>
        </ng-template>
      </app-table>
    </div>

    <!-- ==================== MODAL THÊM MỚI / CHỈNH SỬA ==================== -->
    @if (isFormModalOpen) {
      <div class="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div class="dropdown-animate bg-white rounded-2xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 shadow-liver-red/10 w-full max-w-xl overflow-visible my-8 relative">
            <!-- Modal Header -->
            <div class="px-6 py-4 bg-liver-black text-white flex items-center justify-between border-b-2 border-liver-red rounded-t-2xl">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-lg bg-liver-red flex items-center justify-center text-xs">
                  <i [class]="modalMode === 'ADD' ? 'fa-solid fa-user-plus' : 'fa-solid fa-user-pen'"></i>
                </span>
                <div>
                  <h3 class="text-sm font-bold uppercase tracking-wider">
                    {{ modalMode === 'ADD' ? 'Thêm Mới Người Dùng' : 'Chỉnh Sửa Người Dùng' }}
                  </h3>
                  <p class="text-[11px] text-neutral-400">
                    {{ modalMode === 'ADD' ? 'Nhập thông tin nhân viên mới vào hệ thống' : ('Cập nhật thông tin mã ' + userForm.get('mnv')?.value) }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                (click)="closeFormModal()"
                class="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors"
              >
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <!-- Modal Form Body -->
            <form [formGroup]="userForm" (ngSubmit)="submitUserForm()" class="p-6 space-y-4 text-xs rounded-b-2xl">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Mã nhân viên (MNV) -->
                <div>
                  <app-input
                    formControlName="mnv"
                    label="Mã nhân viên (MNV)"
                    placeholder="VD: LIV-013"
                    [required]="true"
                    [error]="isFieldInvalid('mnv') ? 'Mã nhân viên là bắt buộc (tối thiểu 3 ký tự)' : ''"
                  ></app-input>
                </div>

                <!-- Username -->
                <div>
                  <app-input
                    formControlName="username"
                    label="Username"
                    placeholder="VD: trungdv"
                    icon="fa-solid fa-at"
                    [required]="true"
                    [error]="isFieldInvalid('username') ? 'Username là bắt buộc (tối thiểu 3 ký tự)' : ''"
                  ></app-input>
                </div>

                <!-- Họ và tên -->
                <div class="sm:col-span-2">
                  <app-input
                    formControlName="fullName"
                    label="Họ và tên nhân sự"
                    placeholder="VD: Đỗ Văn Trung"
                    icon="fa-solid fa-user"
                    [required]="true"
                    [error]="isFieldInvalid('fullName') ? 'Họ và tên không được để trống' : ''"
                  ></app-input>
                </div>

                <!-- Email -->
                <div>
                  <app-input
                    formControlName="email"
                    type="email"
                    label="Email liên hệ"
                    placeholder="VD: trung.do@liver.io"
                    icon="fa-solid fa-envelope"
                    [required]="true"
                    [error]="isFieldInvalid('email') ? 'Email không hợp lệ' : ''"
                  ></app-input>
                </div>

                <!-- Số điện thoại (SDT) -->
                <div>
                  <app-input
                    formControlName="phone"
                    label="Số điện thoại (SDT)"
                    placeholder="VD: 0988123456"
                    icon="fa-solid fa-phone"
                    [required]="true"
                    [error]="isFieldInvalid('phone') ? 'Số điện thoại bắt buộc (9-11 chữ số)' : ''"
                  ></app-input>
                </div>

                <!-- Vai trò (Role) -->
                <div>
                  <app-select
                    formControlName="role"
                    label="Vai trò / Phân quyền"
                    placeholder="Chọn vai trò..."
                    [options]="roleFormOptions"
                    mode="single"
                    [required]="true"
                    placement="auto"
                  ></app-select>
                </div>

                <!-- Trạng thái hoạt động -->
                <div>
                  <app-select
                    formControlName="status"
                    label="Trạng thái hoạt động"
                    placeholder="Chọn trạng thái..."
                    [options]="statusFormOptions"
                    mode="single"
                    [required]="true"
                    placement="auto"
                  ></app-select>
                </div>
              </div>

              <!-- Modal Footer Actions -->
              <div class="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  (click)="closeFormModal()"
                  class="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  [disabled]="userForm.invalid || isSubmitting"
                  class="px-5 py-2 rounded-lg bg-liver-red hover:bg-liver-redHover text-white font-bold transition-all shadow-md shadow-liver-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  @if (isSubmitting) {
                    <i class="fa-solid fa-spinner animate-spin"></i>
                  }
                  <span>{{ modalMode === 'ADD' ? 'Tạo Người Dùng' : 'Lưu Thay Đổi' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    <!-- ==================== POPUP CONFIRM DELETE (ĐƠN LẺ HOẶC HÀNG LOẠT) ==================== -->
    @if (isDeleteModalOpen) {
      <div class="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="dropdown-animate bg-white rounded-2xl shadow-2xl border border-liver-redBorder shadow-liver-red/15 w-full max-w-md overflow-hidden p-6 text-center space-y-4">
          <!-- Danger Icon with Pulse Ring -->
          <div class="w-14 h-14 rounded-full bg-liver-redLight text-liver-red border border-liver-redBorder mx-auto flex items-center justify-center text-xl shadow-inner">
            <i class="fa-solid fa-triangle-exclamation animate-bounce"></i>
          </div>

          <!-- Delete Confirmation Title -->
          <div class="space-y-1">
            <h3 class="text-base font-bold text-liver-black">
              {{ deleteTargetMode === 'SINGLE' ? 'Xác Nhận Xóa Người Dùng' : ('Xác Nhận Xóa ' + selectedUsers.length + ' Người Dùng') }}
            </h3>
            <p class="text-xs text-neutral-500">
              @if (deleteTargetMode === 'SINGLE' && userToDelete) {
                Bạn có chắc chắn muốn xóa nhân sự <b class="text-liver-black">{{ userToDelete.fullName }}</b> (Mã: <span class="text-liver-red font-bold">{{ userToDelete.mnv }}</span>)? Hành động này không thể hoàn tác.
              } @else {
                Bạn đang chọn xóa đồng thời <b class="text-liver-red">{{ selectedUsers.length }} người dùng</b>. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
              }
            </p>
          </div>

          <!-- Preview List for Multiple Delete -->
          @if (deleteTargetMode === 'BATCH') {
            <div class="max-h-28 overflow-y-auto bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-left space-y-1">
              @for (u of selectedUsers; track u.id) {
                <div class="flex items-center justify-between text-[11px] text-neutral-700">
                  <span class="font-bold text-liver-black">{{ u.mnv }} - {{ u.fullName }}</span>
                  <span class="text-neutral-400">({{ u.role }})</span>
                </div>
              }
            </div>
          }

          <!-- Confirm / Cancel Buttons -->
          <div class="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              (click)="closeDeleteModal()"
              class="flex-1 py-2 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold text-xs transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              (click)="confirmDelete()"
              [disabled]="isDeleting"
              class="flex-1 py-2 px-4 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs transition-all shadow-md shadow-liver-red/25 flex items-center justify-center gap-2"
            >
              @if (isDeleting) {
                <i class="fa-solid fa-spinner animate-spin"></i>
              }
              <span>{{ deleteTargetMode === 'SINGLE' ? 'Xóa Vĩnh Viễn' : 'Xác Nhận Xóa Tất Cả' }}</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class UsersComponent extends BaseComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Raw data from service
  usersList: User[] = [];
  selectedUsers: User[] = [];

  // Filter state
  filterKeyword = '';
  filterRole = 'ALL';
  filterStatus = 'ALL';

  readonly roleFilterOptions: SelectOption[] = [
    { id: 'ALL', label: 'Tất cả vai trò' },
    { id: 'ADMIN', label: 'ADMIN (Quản trị viên)' },
    { id: 'MANAGER', label: 'MANAGER (Quản lý)' },
    { id: 'DEVELOPER', label: 'DEVELOPER (Lập trình viên)' },
    { id: 'DEVOPS', label: 'DEVOPS (Kỹ sư hạ tầng)' },
    { id: 'DESIGNER', label: 'DESIGNER (Thiết kế UI/UX)' },
    { id: 'TESTER', label: 'TESTER (Kiểm thử phần mềm)' }
  ];

  readonly statusFilterOptions: SelectOption[] = [
    { id: 'ALL', label: 'Tất cả trạng thái' },
    { id: 'ACTIVE', label: 'Hoạt động (Active)' },
    { id: 'INACTIVE', label: 'Ngừng hoạt động (Inactive)' },
    { id: 'LOCKED', label: 'Đã khóa tài khoản (Locked)' }
  ];

  readonly roleFormOptions: SelectOption[] = [
    { id: 'ADMIN', label: 'ADMIN (Quản trị hệ thống)' },
    { id: 'MANAGER', label: 'MANAGER (Quản lý cấp cao)' },
    { id: 'DEVELOPER', label: 'DEVELOPER (Lập trình viên)' },
    { id: 'DEVOPS', label: 'DEVOPS (Kỹ sư hạ tầng)' },
    { id: 'DESIGNER', label: 'DESIGNER (Thiết kế đồ họa)' },
    { id: 'TESTER', label: 'TESTER (Kiểm thử QA/QC)' }
  ];

  readonly statusFormOptions: SelectOption[] = [
    { id: 'ACTIVE', label: 'ACTIVE (Đang hoạt động)' },
    { id: 'INACTIVE', label: 'INACTIVE (Tạm ngừng)' },
    { id: 'LOCKED', label: 'LOCKED (Khóa tài khoản)' }
  ];

  // Modal Form state
  isFormModalOpen = false;
  modalMode: 'ADD' | 'EDIT' = 'ADD';
  editingUserId: string | null = null;
  userForm!: FormGroup;

  // Delete Modal state
  isDeleteModalOpen = false;
  deleteTargetMode: 'SINGLE' | 'BATCH' = 'SINGLE';
  userToDelete: User | null = null;
  isDeleting = false;

  // Table Columns Definition
  readonly tableColumns: TableColumn<User>[] = [
    {
      key: 'stt',
      title: 'STT',
      width: '60px',
      align: 'center',
      templateName: 'sttCol'
    },
    {
      key: 'mnv',
      title: 'Mã NV',
      width: '110px',
      sticky: 'left',
      sortable: true,
      templateName: 'mnvCol'
    },
    {
      key: 'fullName',
      title: 'Họ Tên / Username',
      minWidth: '220px',
      sortable: true,
      templateName: 'userCol'
    },
    {
      key: 'role',
      title: 'Vai Trò',
      width: '140px',
      sortable: true,
      templateName: 'roleCol'
    },
    {
      key: 'phone',
      title: 'Số Điện Thoại (SDT)',
      width: '150px',
      sortable: true,
      templateName: 'phoneCol'
    },
    {
      key: 'status',
      title: 'Trạng Thái',
      width: '150px',
      sortable: true,
      templateName: 'statusCol'
    },
    {
      key: 'createdAt',
      title: 'Ngày Tạo (Created)',
      width: '160px',
      sortable: true,
      templateName: 'createdCol'
    },
    {
      key: 'updatedAt',
      title: 'Ngày Cập Nhật (Updated)',
      width: '160px',
      sortable: true,
      templateName: 'updatedCol'
    },
    {
      key: 'actions',
      title: 'Thao Tác',
      width: '110px',
      align: 'center',
      sticky: 'right',
      templateName: 'actionsCol'
    }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      mnv: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,11}$/)]],
      role: ['DEVELOPER', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.userService
      .getUsers({
        keyword: this.filterKeyword,
        role: this.filterRole,
        status: this.filterStatus
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: users => {
          this.usersList = users;
          // Keep selectedUsers updated if any were deleted
          const validIdSet = new Set(users.map(u => u.id));
          this.selectedUsers = this.selectedUsers.filter(u => validIdSet.has(u.id));
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // Returns list with recalculated STT (No.)
  get usersListWithIndex(): User[] {
    return this.usersList.map((u, i) => ({
      ...u,
      stt: i + 1
    }));
  }

  get totalUsersCount(): number {
    return this.userService.users().length;
  }

  get activeUsersCount(): number {
    return this.userService.users().filter(u => u.status === 'ACTIVE').length;
  }

  get lockedOrInactiveCount(): number {
    return this.userService.users().filter(u => u.status !== 'ACTIVE').length;
  }

  get isFiltered(): boolean {
    return !!this.filterKeyword || this.filterRole !== 'ALL' || this.filterStatus !== 'ALL';
  }

  applyFilter(): void {
    this.loadUsers();
  }

  resetFilters(): void {
    this.filterKeyword = '';
    this.filterRole = 'ALL';
    this.filterStatus = 'ALL';
    this.loadUsers();
  }

  onSelectionChange(selected: User[]): void {
    this.selectedUsers = selected;
  }

  // ==================== ADD / EDIT USER MODAL ====================
  openAddModal(): void {
    this.modalMode = 'ADD';
    this.editingUserId = null;
    const nextMNV = this.userService.getNextMNV();
    this.userForm.reset({
      mnv: nextMNV,
      username: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'DEVELOPER',
      status: 'ACTIVE'
    });
    this.isFormModalOpen = true;
  }

  openEditModal(user: User): void {
    this.modalMode = 'EDIT';
    this.editingUserId = user.id;
    this.userForm.patchValue({
      mnv: user.mnv,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.userForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  submitUserForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.userForm.value;

    // Helper for initials
    const words = formVal.fullName.trim().split(' ');
    const avatar = words.length > 1
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : formVal.fullName.substring(0, 2).toUpperCase();

    if (this.modalMode === 'ADD') {
      this.userService
        .createUser({
          mnv: formVal.mnv,
          username: formVal.username.toLowerCase().trim(),
          fullName: formVal.fullName.trim(),
          email: formVal.email.trim(),
          phone: formVal.phone.trim(),
          role: formVal.role,
          status: formVal.status,
          avatar: avatar,
          avatarBg: 'var(--liver-red)'
        })
        .subscribe({
          next: created => {
            this.isSubmitting = false;
            this.closeFormModal();
            this.loadUsers();
            this.showSuccess(`Thêm thành công người dùng ${created.fullName} (${created.mnv})`);
            this.cdr.detectChanges();
          },
          error: () => {
            this.isSubmitting = false;
            this.showError('Lỗi khi thêm người dùng');
            this.cdr.detectChanges();
          }
        });
    } else if (this.modalMode === 'EDIT' && this.editingUserId) {
      this.userService
        .updateUser(this.editingUserId, {
          mnv: formVal.mnv,
          username: formVal.username.toLowerCase().trim(),
          fullName: formVal.fullName.trim(),
          email: formVal.email.trim(),
          phone: formVal.phone.trim(),
          role: formVal.role,
          status: formVal.status,
          avatar: avatar
        })
        .subscribe({
          next: updated => {
            this.isSubmitting = false;
            this.closeFormModal();
            this.loadUsers();
            this.showSuccess(`Cập nhật thông tin ${updated.fullName} thành công!`);
            this.cdr.detectChanges();
          },
          error: () => {
            this.isSubmitting = false;
            this.showError('Lỗi khi cập nhật người dùng');
            this.cdr.detectChanges();
          }
        });
    }
  }

  // ==================== DELETE MODAL ====================
  openSingleDeleteModal(user: User): void {
    this.deleteTargetMode = 'SINGLE';
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  openBatchDeleteModal(): void {
    if (this.selectedUsers.length === 0) return;
    this.deleteTargetMode = 'BATCH';
    this.userToDelete = null;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    this.isDeleting = true;

    if (this.deleteTargetMode === 'SINGLE' && this.userToDelete) {
      const targetUser = this.userToDelete;
      this.userService.deleteUser(targetUser.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.closeDeleteModal();
          this.loadUsers();
          this.showSuccess(`Đã xóa người dùng ${targetUser.fullName} (${targetUser.mnv})`);
          this.cdr.detectChanges();
        },
        error: () => {
          this.isDeleting = false;
          this.showError('Lỗi khi xóa người dùng');
          this.cdr.detectChanges();
        }
      });
    } else if (this.deleteTargetMode === 'BATCH') {
      const ids = this.selectedUsers.map(u => u.id);
      const count = ids.length;
      this.userService.deleteMultipleUsers(ids).subscribe({
        next: () => {
          this.isDeleting = false;
          this.closeDeleteModal();
          this.selectedUsers = [];
          this.loadUsers();
          this.showSuccess(`Đã xóa thành công ${count} người dùng được chọn`);
          this.cdr.detectChanges();
        },
        error: () => {
          this.isDeleting = false;
          this.showError('Lỗi khi xóa nhiều người dùng');
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ==================== HELPERS ====================
  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-neutral-900 text-white border-neutral-700 shadow-sm';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEVELOPER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DEVOPS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DESIGNER':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'TESTER':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  }

  getRoleIcon(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return 'fa-solid fa-shield-halved text-liver-red';
      case 'MANAGER':
        return 'fa-solid fa-briefcase text-blue-600';
      case 'DEVELOPER':
        return 'fa-solid fa-code text-emerald-600';
      case 'DEVOPS':
        return 'fa-solid fa-server text-purple-600';
      case 'DESIGNER':
        return 'fa-solid fa-pen-nib text-amber-600';
      case 'TESTER':
        return 'fa-solid fa-bug text-cyan-600';
      default:
        return 'fa-solid fa-user';
    }
  }

  getStatusLabel(status: UserStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'INACTIVE':
        return 'Tạm ngừng';
      case 'LOCKED':
        return 'Đã khóa';
      default:
        return status;
    }
  }
}
