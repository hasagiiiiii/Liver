import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputNumberComponent } from './input-number.component';

describe('InputNumberComponent', () => {
  let fixture: ComponentFixture<InputNumberComponent>;
  let component: InputNumberComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumberComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create input number component', () => {
    expect(component).toBeTruthy();
  });

  it('should increase value with step', () => {
    component.value = 1000;
    component.step = 500;
    component.stepValue(500);
    expect(component.value).toBe(1500);
  });

  it('should decrease value with step', () => {
    component.value = 1000;
    component.step = 500;
    component.stepValue(-500);
    expect(component.value).toBe(500);
  });

  it('should respect min bound', () => {
    component.min = 0;
    component.value = 200;
    component.stepValue(-500);
    expect(component.value).toBe(0);
  });

  it('should have spin button suppression styles applied', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="number"]');
    expect(input).toBeTruthy();
    expect(input.classList.contains('[appearance:textfield]')).toBe(true);
  });
});

