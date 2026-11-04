import { Injectable, signal } from '@angular/core';

export interface ThemePalette {
  id: string;
  name: string;
  black: string;
  dark: string;
  panel: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentBorder: string;
}

function hexToRgb(hex: string): string {
  if (!hex) return '0 0 0';
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `${r} ${g} ${b}`;
}

@Injectable({
  providedIn: 'root'
})
export class ThemePaletteService {
  readonly palettes: ThemePalette[] = [
    {
      id: 'crimson',
      name: 'Đen - Đỏ - Trắng (Mặc định)',
      black: '#0a0a0c',
      dark: '#141417',
      panel: '#1c1c21',
      accent: '#dc2626',
      accentHover: '#b91c1c',
      accentLight: '#fef2f2',
      accentBorder: '#fecaca'
    },
    {
      id: 'gold',
      name: 'Đen - Vàng Gold - Trắng',
      black: '#0c0a09',
      dark: '#1c1917',
      panel: '#292524',
      accent: '#d97706',
      accentHover: '#b45309',
      accentLight: '#fffbeb',
      accentBorder: '#fde68a'
    },
    {
      id: 'emerald',
      name: 'Đen - Xanh Ngọc - Trắng',
      black: '#090d0b',
      dark: '#111815',
      panel: '#1a2420',
      accent: '#059669',
      accentHover: '#047857',
      accentLight: '#ecfdf5',
      accentBorder: '#a7f3d0'
    },
    {
      id: 'cobalt',
      name: 'Đen Navy - Xanh Dương - Trắng',
      black: '#090d16',
      dark: '#0f172a',
      panel: '#1e293b',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      accentLight: '#eff6ff',
      accentBorder: '#bfdbfe'
    },
    {
      id: 'violet',
      name: 'Đen Tím - Violet - Trắng',
      black: '#0d0914',
      dark: '#171024',
      panel: '#231836',
      accent: '#7c3aed',
      accentHover: '#6d28d9',
      accentLight: '#f5f3ff',
      accentBorder: '#ddd6fe'
    }
  ];

  private readonly activeThemeId = signal<string>('crimson');
  readonly currentPalette = signal<ThemePalette>(this.palettes[0]);

  constructor() {
    this.applyPalette(this.palettes[0]);
  }

  getPalettes(): ThemePalette[] {
    return this.palettes;
  }

  getActiveThemeId(): string {
    return this.activeThemeId();
  }

  setTheme(paletteId: string): void {
    const palette = this.palettes.find(p => p.id === paletteId);
    if (!palette) return;

    this.activeThemeId.set(paletteId);
    this.currentPalette.set(palette);
    this.applyPalette(palette);
  }

  private applyPalette(palette: ThemePalette): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.style.setProperty('--liver-black', palette.black);
    root.style.setProperty('--liver-black-rgb', hexToRgb(palette.black));

    root.style.setProperty('--liver-dark', palette.dark);
    root.style.setProperty('--liver-dark-rgb', hexToRgb(palette.dark));

    root.style.setProperty('--liver-panel', palette.panel);
    root.style.setProperty('--liver-panel-rgb', hexToRgb(palette.panel));

    root.style.setProperty('--liver-red', palette.accent);
    root.style.setProperty('--liver-red-rgb', hexToRgb(palette.accent));

    root.style.setProperty('--liver-red-hover', palette.accentHover);
    root.style.setProperty('--liver-red-hover-rgb', hexToRgb(palette.accentHover));

    root.style.setProperty('--liver-red-light', palette.accentLight);
    root.style.setProperty('--liver-red-light-rgb', hexToRgb(palette.accentLight));

    root.style.setProperty('--liver-red-border', palette.accentBorder);
    root.style.setProperty('--liver-red-border-rgb', hexToRgb(palette.accentBorder));
  }
}
