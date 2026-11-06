import {
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  AfterContentInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabVariant = 'line' | 'pills' | 'enclosed';
export type TabSize = 'sm' | 'md' | 'lg';

export interface TabChangeEvent {
  index: number;
  id: string;
  label: string;
}

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (active()) {
      <div role="tabpanel" class="tab-pane animate-fadeIn">
        <ng-content></ng-content>
      </div>
    }
  `
})
export class TabComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() icon = '';
  @Input() badge: string | number = '';
  @Input() disabled = false;
  @Input() customClass = '';

  readonly active = signal(false);
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Tabs Navigation Header Bar -->
      <div
        [ngClass]="getHeaderWrapperClasses()"
        class="flex items-center overflow-x-auto no-scrollbar select-none"
        role="tablist"
      >
        <div class="flex items-center gap-1 min-w-full sm:min-w-0" [class.w-full]="fullWidth">
          @for (tab of tabsList; track tab.id || $index; let i = $index) {
            <button
              type="button"
              role="tab"
              [disabled]="tab.disabled"
              (click)="selectTab(tab, i)"
              [class]="getTabButtonClasses(tab, i)"
              [style.flex]="fullWidth ? '1 1 0%' : 'none'"
              class="group relative inline-flex items-center justify-center gap-2 font-bold transition-all focus:outline-none shrink-0"
            >
              <!-- Icon -->
              @if (tab.icon) {
                <i [class]="tab.icon" [class.text-liver-red]="isTabActive(tab, i) && variant === 'line'"></i>
              }

              <!-- Tab Label -->
              <span class="truncate">{{ tab.label }}</span>

              <!-- Badge / Counter -->
              @if (tab.badge !== '' && tab.badge !== undefined && tab.badge !== null) {
                <span
                  [ngClass]="getBadgeClasses(tab, i)"
                  class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold leading-none transition-colors"
                >
                  {{ tab.badge }}
                </span>
              }

              <!-- Bottom Indicator for 'line' variant -->
              @if (variant === 'line' && isTabActive(tab, i)) {
                <span
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-liver-red rounded-t-full transition-all"
                ></span>
              }
            </button>
          }
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(2px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  @Input() activeKey = '';
  @Output() activeKeyChange = new EventEmitter<string>();

  @Input() variant: TabVariant = 'line';
  @Input() size: TabSize = 'md';
  @Input() fullWidth = false;

  @Output() tabChange = new EventEmitter<TabChangeEvent>();

  tabsList: TabComponent[] = [];
  currentIndex = 0;

  ngAfterContentInit(): void {
    this.refreshTabs();
    this.tabs.changes.subscribe(() => {
      this.refreshTabs();
    });
  }

  private refreshTabs(): void {
    this.tabsList = this.tabs.toArray();

    if (this.tabsList.length === 0) return;

    let targetTab: TabComponent | undefined;
    if (this.activeKey) {
      targetTab = this.tabsList.find(t => t.id === this.activeKey && !t.disabled);
    }

    if (!targetTab) {
      targetTab = this.tabsList.find(t => !t.disabled) || this.tabsList[0];
    }

    if (targetTab) {
      const idx = this.tabsList.indexOf(targetTab);
      this.setActiveTab(targetTab, idx, false);
    }
  }

  selectTab(tab: TabComponent, index: number): void {
    if (tab.disabled) return;
    this.setActiveTab(tab, index, true);
  }

  private setActiveTab(tab: TabComponent, index: number, emitEvent: boolean): void {
    this.currentIndex = index;
    this.tabsList.forEach((t, i) => {
      t.active.set(i === index);
    });

    const selectedId = tab.id || String(index);
    this.activeKey = selectedId;

    if (emitEvent) {
      this.activeKeyChange.emit(selectedId);
      this.tabChange.emit({
        index,
        id: selectedId,
        label: tab.label
      });
    }
  }

  isTabActive(tab: TabComponent, index: number): boolean {
    return tab.active() || (this.activeKey ? tab.id === this.activeKey : this.currentIndex === index);
  }

  getHeaderWrapperClasses(): string {
    switch (this.variant) {
      case 'line':
        return 'border-b border-neutral-200';
      case 'pills':
        return 'p-1 bg-neutral-100 rounded-xl';
      case 'enclosed':
        return 'border-b border-neutral-200';
      default:
        return 'border-b border-neutral-200';
    }
  }

  getTabButtonClasses(tab: TabComponent, index: number): string {
    const isActive = this.isTabActive(tab, index);
    const sizeClasses = this.getSizeClasses();

    if (tab.disabled) {
      return `${sizeClasses} opacity-40 cursor-not-allowed text-neutral-400`;
    }

    switch (this.variant) {
      case 'line':
        return isActive
          ? `${sizeClasses} text-liver-red font-extrabold pb-3.5`
          : `${sizeClasses} text-neutral-600 hover:text-liver-black pb-3.5`;

      case 'pills':
        return isActive
          ? `${sizeClasses} bg-liver-red text-white shadow-md shadow-liver-red/25 rounded-lg`
          : `${sizeClasses} text-neutral-600 hover:text-liver-black hover:bg-neutral-200/70 rounded-lg`;

      case 'enclosed':
        return isActive
          ? `${sizeClasses} bg-white text-liver-red border-t-2 border-x border-neutral-200 border-t-liver-red -mb-px rounded-t-lg font-bold shadow-sm`
          : `${sizeClasses} bg-neutral-50 text-neutral-600 hover:text-liver-black border-transparent rounded-t-lg`;

      default:
        return sizeClasses;
    }
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-4 py-2 text-xs sm:text-sm';
      case 'lg':
        return 'px-5 py-2.5 text-sm sm:text-base';
      default:
        return 'px-4 py-2 text-xs sm:text-sm';
    }
  }

  getBadgeClasses(tab: TabComponent, index: number): string {
    const isActive = this.isTabActive(tab, index);

    if (this.variant === 'pills' && isActive) {
      return 'bg-white/20 text-white';
    }

    if (isActive) {
      return 'bg-liver-redLight text-liver-red border border-liver-redBorder';
    }

    return 'bg-neutral-200 text-neutral-700';
  }
}
