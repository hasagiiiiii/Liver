import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerComponent } from './drawer.component';
import { DrawerService } from '../../../core/services/drawer.service';

describe('DrawerComponent', () => {
  let fixture: ComponentFixture<DrawerComponent>;
  let component: DrawerComponent;
  let service: DrawerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerComponent],
      providers: [DrawerService]
    }).compileComponents();

    service = TestBed.inject(DrawerService);
    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    component.title = 'Bảng điều khiển';
    component.isOpen = true;
    fixture.detectChanges();
  });

  it('should create drawer component', () => {
    expect(component).toBeTruthy();
  });

  it('should render drawer title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Bảng điều khiển');
  });

  it('should open and close via DrawerService', () => {
    component.isOpen = false;
    fixture.detectChanges();

    service.open({
      title: 'Service Drawer'
    });
    fixture.detectChanges();

    expect(component.computedIsOpen).toBe(true);
    expect(component.computedTitle).toBe('Service Drawer');

    service.close();
    fixture.detectChanges();

    expect(component.computedIsOpen).toBe(false);
  });
});
