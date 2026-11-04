import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { MENU_ITEMS } from '../../core/constants/menu.constant';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create sidebar component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default menuItems from constant', () => {
    expect(component.menuItems).toEqual(MENU_ITEMS);
    expect(component.menuItems.length).toBeGreaterThan(0);
  });

  it('should toggle submenu expansion', () => {
    expect(component.isSubmenuExpanded({ label: 'Components', id: 'components' })).toBe(true);
    component.toggleSubmenu('components');
    expect(component.isSubmenuExpanded({ label: 'Components', id: 'components' })).toBe(false);
  });

  it('should render menu labels in template', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('UI Controls & Form');
    expect(el.textContent).toContain('Sticky & Sort Table');
    expect(el.textContent).toContain('Components');
  });
});

