import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangeComponent } from './date-range.component';

describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create date-range component', () => {
    expect(component).toBeTruthy();
  });

  it('should format initial date-range properly in displayValue', () => {
    component.writeValue({ startDate: '2026-11-01', endDate: '2026-11-15' });
    expect(component.displayValue).toBe('01/11/2026 - 15/11/2026');
    expect(component.totalDays).toBe(15);
  });

  it('should automatically open calendar popup when input is focused or clicked', () => {
    expect(component.isOpen).toBe(false);

    component.openPopup();
    expect(component.isOpen).toBe(true);
    expect(component.selectingState).toBe('START');

    // Calling openPopup when already open should keep it open
    component.openPopup();
    expect(component.isOpen).toBe(true);

    component.closePopup();
    expect(component.isOpen).toBe(false);

    // Dispatch focus event on range input
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    expect(component.isOpen).toBe(true);
  });

  it('should support direct typing of valid range (DD/MM/YYYY - DD/MM/YYYY)', () => {
    let emittedVal: any = null;
    component.registerOnChange(val => (emittedVal = val));

    const mockEvent = {
      target: { value: '05/10/2026 - 20/10/2026' }
    } as unknown as Event;

    component.onInputTyped(mockEvent);

    expect(component.value.startDate).toBe('2026-10-05');
    expect(component.value.endDate).toBe('2026-10-20');
    expect(emittedVal).toEqual({ startDate: '2026-10-05', endDate: '2026-10-20' });
    expect(component.totalDays).toBe(16);
  });

  it('should support quick preset buttons', () => {
    let emittedVal: any = null;
    component.registerOnChange(val => (emittedVal = val));

    component.setQuickRange(7);
    expect(component.value.startDate).toBeTruthy();
    expect(component.value.endDate).toBeTruthy();
    expect(emittedVal).toBeTruthy();
  });

  it('should clear value when clear method is called', () => {
    component.value = { startDate: '2026-11-01', endDate: '2026-11-15' };
    let emittedVal: any = null;
    component.registerOnChange(val => (emittedVal = val));

    component.clear();
    expect(component.value.startDate).toBe('');
    expect(component.value.endDate).toBe('');
    expect(emittedVal).toEqual({ startDate: '', endDate: '' });
  });

  it('should select start and end days sequentially', () => {
    component.currentYear = 2026;
    component.currentMonth = 10; // November
    component.selectingState = 'START';

    component.selectDay(5);
    expect(component.value.startDate).toBe('2026-11-05');
    expect(component.selectingState).toBe('END');

    component.selectDay(20);
    expect(component.value.endDate).toBe('2026-11-20');
    expect(component.selectingState).toBe('START');
  });
});
