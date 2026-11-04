import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let fixture: ComponentFixture<LogoComponent>;
  let component: LogoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create logo component', () => {
    expect(component).toBeTruthy();
  });

  it('should render animated SVG with letter L paths', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('should apply custom size', () => {
    fixture.componentRef.setInput('size', 56);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.style.width).toBe('56px');
    expect(container.style.height).toBe('56px');
  });
});
