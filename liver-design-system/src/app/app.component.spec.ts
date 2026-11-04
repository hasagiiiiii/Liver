import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { ThemePaletteService } from './core/services/theme-palette.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the application root component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'liver-design-system'`, () => {
    expect(component.title).toEqual('liver-design-system');
  });
});

describe('ThemePaletteService', () => {
  let service: ThemePaletteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemePaletteService);
  });

  it('should be created and have default crimson theme', () => {
    expect(service).toBeTruthy();
    expect(service.getActiveThemeId()).toBe('crimson');
  });

  it('should switch theme correctly', () => {
    service.setTheme('gold');
    expect(service.getActiveThemeId()).toBe('gold');
  });
});
