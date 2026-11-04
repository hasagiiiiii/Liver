import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TreeNode } from '../../../core/services/api.service';

@Component({
  selector: 'app-tree-select',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1.5 relative" (appClickOutside)="closeDropdown()">
      @if (label) {
        <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
          {{ label }}
          @if (required) {
            <span class="text-liver-red">*</span>
          }
        </label>
      }

      <div class="relative">
        <button
          type="button"
          (click)="toggleDropdown()"
          [disabled]="disabled"
          [class.border-liver-red]="isOpen"
          class="w-full h-[42px] px-3.5 text-sm bg-white border border-neutral-300 hover:border-liver-red/60 rounded-lg flex items-center justify-between text-liver-black font-medium transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
        >
          <div class="flex items-center gap-2 truncate">
            <i class="fa-solid fa-sitemap text-liver-red"></i>
            <span
              class="font-semibold text-xs truncate"
              [class.text-liver-black]="selectedPath"
              [class.text-neutral-400]="!selectedPath"
              [class.font-normal]="!selectedPath"
            >
              {{ selectedPath || placeholder }}
            </span>
          </div>
          <i class="fa-solid fa-chevron-down text-xs text-neutral-400 transition-transform" [class.rotate-180]="isOpen"></i>
        </button>

        <!-- Tree Dropdown Menu -->
        @if (isOpen) {
          <div class="dropdown-animate absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 z-50 p-3">
            <div class="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 text-xs">
              <span class="font-bold text-neutral-400 uppercase text-[10px]">Cơ cấu tổ chức</span>
              <button
                type="button"
                (click)="expandAll()"
                class="text-liver-red hover:underline font-bold text-[11px]"
              >
                Mở rộng tất cả
              </button>
            </div>

            <div class="space-y-2 max-h-56 overflow-y-auto text-xs">
              @for (parent of treeData; track parent.id; let pIdx = $index) {
                <div class="space-y-1">
                  <!-- Parent Row -->
                  <div
                    (click)="toggleParent(pIdx, $event)"
                    class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer font-bold text-liver-black"
                  >
                    <div class="flex items-center gap-2">
                      <span class="w-4 h-4 rounded bg-liver-black text-white flex items-center justify-center text-[9px]">
                        <i [class]="parent.expanded ? 'fa-solid fa-minus' : 'fa-solid fa-plus'"></i>
                      </span>
                      <i class="fa-regular fa-folder-open text-liver-red"></i>
                      <span>{{ parent.label }}</span>
                    </div>
                  </div>

                  <!-- Children Row -->
                  @if (parent.expanded && parent.children) {
                    <div class="ml-5 pl-3 border-l-2 border-neutral-200 space-y-1">
                      @for (child of parent.children; track child.id) {
                        <div
                          (click)="selectChild(parent, child)"
                          [ngClass]="{
                            'bg-liver-red text-white font-bold': isSelected(parent, child),
                            'hover:bg-neutral-100 text-neutral-700': !isSelected(parent, child)
                          }"
                          class="flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                        >
                          <div class="flex items-center gap-2">
                            <i
                              [ngClass]="isSelected(parent, child) ? 'text-white' : 'text-liver-red'"
                              class="fa-solid fa-code-branch text-[10px]"
                            ></i>
                            <span>{{ child.label }}</span>
                          </div>
                          @if (isSelected(parent, child)) {
                            <i class="fa-solid fa-check text-[10px]"></i>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>

      @if (hint) {
        <p class="text-[11px] text-neutral-500">{{ hint }}</p>
      }
    </div>
  `
})
export class TreeSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Chọn phòng ban / đơn vị...';
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;

  @Input() treeData: TreeNode[] = [];

  selectedPath = '';
  isOpen = false;

  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.selectedPath = val || '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  toggleParent(index: number, event: Event): void {
    event.stopPropagation();
    this.treeData[index].expanded = !this.treeData[index].expanded;
  }

  expandAll(): void {
    this.treeData.forEach(p => (p.expanded = true));
  }

  selectChild(parent: TreeNode, child: { id: string; label: string }): void {
    const parentName = parent.label.split(' (')[0];
    this.selectedPath = `${parentName} > ${child.label}`;
    this.onChange(this.selectedPath);
    this.onTouched();
    this.closeDropdown();
  }

  isSelected(parent: TreeNode, child: { id: string; label: string }): boolean {
    const parentName = parent.label.split(' (')[0];
    return this.selectedPath === `${parentName} > ${child.label}`;
  }
}
