import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create datepicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format initial date properly in displayValue', () => {
    component.writeValue('2026-11-04');
    expect(component.displayValue).toBe('04/11/2026');
  });

  it('should NOT show quarter option when quarter is false (default)', () => {
    component.mode = 'date';
    component.quarter = false;
    component.allowQuarter = false;
    component.isOpen = true;
    component.viewMode = 'date';
    fixture.detectChanges();

    expect(component.isQuarterMode).toBe(false);
    expect(component.isQuarterEnabled).toBe(false);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Quý 1');
    expect(compiled.textContent).not.toContain('Quý 2');
    expect(compiled.textContent).not.toContain('Quý này');
  });

  it('should show quarter view ONLY and NOT show day/month when quarter is enabled', () => {
    fixture.componentRef.setInput('quarter', true);
    component.isOpen = true;
    component.viewMode = 'quarter';
    fixture.detectChanges();

    expect(component.isQuarterMode).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    // Khi đã bật chọn Quý sẽ không còn chọn ngày tháng nữa:
    expect(compiled.textContent).toContain('Quý 1');
    expect(compiled.textContent).toContain('Quý 2');
    expect(compiled.textContent).toContain('Quý 3');
    expect(compiled.textContent).toContain('Quý 4');
    expect(compiled.textContent).toContain('Quý này');
    // Không còn phần chọn ngày tháng:
    expect(compiled.textContent).not.toContain('Tháng trước');
    expect(compiled.textContent).not.toContain('Theo Ngày');
  });

  it('should return to quarter view when selecting year in quarter mode, without going to month/date', () => {
    component.quarter = true;
    component.isOpen = true;
    component.viewMode = 'quarter';
    component.currentYear = 2026;

    component.openYearView();
    expect(component.viewMode).toBe('year');

    component.selectYear(2028);
    expect(component.currentYear).toBe(2028);
    expect(component.viewMode).toBe('quarter'); // Quay về màn chọn Quý
  });

  it('should parse quarter typing and ignore day/month typing when in quarter mode', () => {
    component.quarter = true;
    let emitted = '';
    component.registerOnChange(val => (emitted = val));

    // Gõ đúng định dạng Quý
    component.onInputTyped({ target: { value: 'Quý 3, 2026' } } as unknown as Event);
    expect(component.value).toBe('2026-Q3');
    expect(emitted).toBe('2026-Q3');

    // Gõ ngày tháng sẽ không được nhận vì đang ở chế độ Quý
    component.onInputTyped({ target: { value: '15/01/2026' } } as unknown as Event);
    expect(component.value).toBe('2026-Q3'); // Giữ nguyên giá trị Quý
  });

  it('should support direct typing of valid date (DD/MM/YYYY)', () => {
    let emittedValue = '';
    component.registerOnChange(val => (emittedValue = val));

    const mockEvent = {
      target: { value: '15/01/2026' }
    } as unknown as Event;

    component.onInputTyped(mockEvent);

    expect(component.value).toBe('2026-01-15');
    expect(emittedValue).toBe('2026-01-15');
    expect(component.currentYear).toBe(2026);
    expect(component.currentMonth).toBe(0);
  });

  it('should support Month & Year navigation in popup', () => {
    component.currentYear = 2026;
    component.currentMonth = 5; // June

    component.openMonthView();
    expect(component.viewMode).toBe('month');

    component.selectMonth(8); // September
    expect(component.currentMonth).toBe(8);
    expect(component.viewMode).toBe('date');

    component.openYearView();
    expect(component.viewMode).toBe('year');

    component.selectYear(2028);
    expect(component.currentYear).toBe(2028);
    expect(component.viewMode).toBe('month');
  });

  it('should support selecting Quarter when mode is quarter', () => {
    component.mode = 'quarter';
    component.viewMode = 'quarter';
    component.currentYear = 2026;

    let emitted = '';
    component.registerOnChange(val => (emitted = val));

    component.selectQuarter(3);

    expect(component.value).toBe('2026-Q3');
    expect(emitted).toBe('2026-Q3');
    expect(component.displayValue).toBe('Quý 3, 2026');
    expect(component.isOpen).toBe(false);
  });

  it('should clear value when clear button is clicked', () => {
    component.value = '2026-11-04';
    let emitted = 'init';
    component.registerOnChange(val => (emitted = val));

    component.clear();
    expect(component.value).toBe('');
    expect(emitted).toBe('');
  });

  it('should toggle popup and calculate calendar', () => {
    expect(component.isOpen).toBe(false);
    component.togglePopup();
    expect(component.isOpen).toBe(true);
    expect(component.daysInMonth.length).toBeGreaterThan(27);

    component.closePopup();
    expect(component.isOpen).toBe(false);
  });
});
