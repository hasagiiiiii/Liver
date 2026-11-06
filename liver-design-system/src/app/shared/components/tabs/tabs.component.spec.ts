import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent, TabComponent } from './tabs.component';

@Component({
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <app-tabs [(activeKey)]="currentTab">
      <app-tab id="general" label="Thông tin chung" icon="fa-solid fa-user">
        <p>Nội dung thông tin chung</p>
      </app-tab>
      <app-tab id="security" label="Bảo mật" badge="2">
        <p>Nội dung bảo mật</p>
      </app-tab>
      <app-tab id="disabled-tab" label="Đã khóa" [disabled]="true">
        <p>Nội dung bị khóa</p>
      </app-tab>
    </app-tabs>
  `
})
class TestHostComponent {
  currentTab = 'general';
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TabsComponent, TabComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render all tab headers', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Thông tin chung');
    expect(el.textContent).toContain('Bảo mật');
    expect(el.textContent).toContain('Đã khóa');
  });

  it('should display active tab content and switch on click', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Nội dung thông tin chung');
    expect(el.textContent).not.toContain('Nội dung bảo mật');

    const tabButtons = el.querySelectorAll('button[role="tab"]');
    (tabButtons[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.currentTab).toBe('security');
    expect(el.textContent).toContain('Nội dung bảo mật');
  });

  it('should not activate disabled tab on click', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tabButtons = el.querySelectorAll('button[role="tab"]');
    (tabButtons[2] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.currentTab).toBe('general');
    expect(el.textContent).toContain('Nội dung thông tin chung');
  });
});
