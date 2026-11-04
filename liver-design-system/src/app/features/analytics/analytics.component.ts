import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { CurrencyVNDPipe } from '../../shared/pipes/currency-vnd.pipe';
import { BaseComponent } from '../../shared/components/base/base.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, CurrencyVNDPipe],
  template: `
    <div class="space-y-6">
      <!-- Page Title -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-liver-black">Báo Cáo Thống Kê & Phân Tích Hệ Thống</h1>
          <p class="text-xs text-neutral-500 mt-1">
            Tổng quan hiệu năng ngân sách và tình trạng vận hành dự án LIVER Enterprise.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ thống ổn định 99.98%
          </span>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1 -->
        <div class="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between text-neutral-500">
            <span class="text-xs font-bold uppercase tracking-wider">Tổng Ngân Sách</span>
            <div class="w-8 h-8 rounded-lg bg-liver-redLight text-liver-red flex items-center justify-center">
              <i class="fa-solid fa-coins text-sm"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-liver-black">{{ totalBudget | currencyVND }}</div>
            <p class="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <i class="fa-solid fa-arrow-trend-up"></i>
              <span>+18.4% so với quý trước</span>
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between text-neutral-500">
            <span class="text-xs font-bold uppercase tracking-wider">Dự Án Đang Chạy</span>
            <div class="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <i class="fa-solid fa-bolt text-sm text-liver-red"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-liver-black">{{ activeCount }} / {{ projects.length }}</div>
            <p class="text-[11px] text-neutral-500 font-semibold mt-1">
              Chiếm {{ ((activeCount / (projects.length || 1)) * 100).toFixed(0) }}% tổng danh mục
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between text-neutral-500">
            <span class="text-xs font-bold uppercase tracking-wider">Dự Án Khẩn Cấp</span>
            <div class="w-8 h-8 rounded-lg bg-liver-redLight text-liver-red border border-liver-redBorder flex items-center justify-center">
              <i class="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-liver-red">{{ criticalCount }}</div>
            <p class="text-[11px] text-liver-red font-semibold mt-1">
              Yêu cầu theo dõi sát tiến độ SLA
            </p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between text-neutral-500">
            <span class="text-xs font-bold uppercase tracking-wider">Chờ Duyệt (Pending)</span>
            <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <i class="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
          </div>
          <div>
            <div class="text-2xl font-black text-liver-black">{{ pendingCount }}</div>
            <p class="text-[11px] text-amber-600 font-semibold mt-1">
              Đang đợi phê duyệt từ PO & Tech Lead
            </p>
          </div>
        </div>
      </div>

      <!-- Distribution & Performance Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Distribution by Status -->
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-liver-black">
              Phân Bổ Trạng Thái Dự Án
            </h2>
            <span class="text-xs text-neutral-400">Thời gian thực</span>
          </div>

          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-neutral-700">Active (Đang triển khai)</span>
                <span class="text-liver-black">{{ activeCount }} dự án</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  class="h-full bg-neutral-900 rounded-full transition-all duration-500"
                  [style.width.%]="(activeCount / (projects.length || 1)) * 100"
                ></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-neutral-700">Critical (Ưu tiên đặc biệt)</span>
                <span class="text-liver-red font-bold">{{ criticalCount }} dự án</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  class="h-full bg-liver-red rounded-full transition-all duration-500"
                  [style.width.%]="(criticalCount / (projects.length || 1)) * 100"
                ></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-neutral-700">Pending (Đang chờ duyệt)</span>
                <span class="text-amber-600 font-bold">{{ pendingCount }} dự án</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  class="h-full bg-amber-500 rounded-full transition-all duration-500"
                  [style.width.%]="(pendingCount / (projects.length || 1)) * 100"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Architecture Spec -->
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-liver-black">
              Thông Tin Hạ Tầng & Công Nghệ
            </h2>
            <span class="px-2 py-0.5 rounded bg-liver-red text-white text-[10px] font-bold">LIVER Core</span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold">Framework</span>
              <span class="font-bold text-liver-black">Angular 19+ (Standalone)</span>
            </div>
            <div class="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold">CSS Engine</span>
              <span class="font-bold text-liver-black">Tailwind CSS 3.4+</span>
            </div>
            <div class="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold">State & Reactivity</span>
              <span class="font-bold text-liver-black">Angular Signals & RxJS</span>
            </div>
            <div class="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <span class="text-neutral-400 block text-[10px] uppercase font-bold">Theme Switcher</span>
              <span class="font-bold text-liver-black">CSS Variables (:root)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent extends BaseComponent {
  private readonly apiService = inject(ApiService);

  get projects() {
    return this.apiService.projects();
  }

  get totalBudget(): number {
    return this.projects.reduce((acc, p) => acc + p.budget, 0);
  }

  get activeCount(): number {
    return this.projects.filter(p => p.status === 'Active').length;
  }

  get criticalCount(): number {
    return this.projects.filter(p => p.status === 'Critical').length;
  }

  get pendingCount(): number {
    return this.projects.filter(p => p.status === 'Pending').length;
  }
}
