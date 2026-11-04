import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  standalone: true,
  imports: [ClickOutsideDirective],
  template: `
    <div class="outside-box">Outside Box</div>
    <div class="inside-box" (appClickOutside)="onOutside()">
      <button class="inside-btn">Inside Button</button>
    </div>
  `
})
class TestHostComponent {
  outsideCalled = false;
  onOutside(): void {
    this.outsideCalled = true;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create host with directive', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when clicking outside', () => {
    const outsideEl: HTMLElement = fixture.nativeElement.querySelector('.outside-box');
    outsideEl.click();
    expect(component.outsideCalled).toBe(true);
  });

  it('should NOT emit when clicking inside', () => {
    const insideBtn: HTMLElement = fixture.nativeElement.querySelector('.inside-btn');
    insideBtn.click();
    expect(component.outsideCalled).toBe(false);
  });

  it('should emit on Escape key press', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(component.outsideCalled).toBe(true);
  });
});

