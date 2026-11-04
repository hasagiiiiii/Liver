import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [style.width.px]="size"
      [style.height.px]="size"
      class="relative flex items-center justify-center shrink-0 group select-none cursor-pointer"
    >
      <!-- Background Container with Gradient & Tech Border -->
      <div
        class="absolute inset-0 rounded-xl bg-gradient-to-br from-liver-dark via-neutral-900 to-black border border-liver-red/40 group-hover:border-liver-red shadow-lg shadow-liver-red/25 group-hover:shadow-liver-red/50 transition-all duration-300"
      ></div>

      <!-- Animated SVG Letter L -->
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative w-[78%] h-[78%] transform group-hover:scale-105 transition-transform duration-300"
      >
        <defs>
          <!-- Liver Accent Gradients using Theme CSS Variables -->
          <linearGradient id="liverGradMainComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--liver-red-hover, #ff4d4d)" />
            <stop offset="55%" stop-color="var(--liver-red, #dc2626)" />
            <stop offset="100%" stop-color="var(--liver-dark, #7f1d1d)" />
          </linearGradient>

          <linearGradient id="liverGradStrokeComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
            <stop offset="45%" stop-color="var(--liver-red-light, #ff7b7b)" stop-opacity="0.75" />
            <stop offset="100%" stop-color="var(--liver-red, #dc2626)" stop-opacity="0.3" />
          </linearGradient>

          <linearGradient id="liverLaserGradComp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--liver-red-light, #ff8888)" stop-opacity="0" />
            <stop offset="50%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="100%" stop-color="var(--liver-red, #ff4444)" stop-opacity="0" />
          </linearGradient>

          <!-- Neon Glow Filter -->
          <filter id="liverNeonGlowComp" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Ambient Outer Glow -->
        <circle cx="50" cy="50" r="38" fill="url(#liverGradMainComp)" opacity="0.18" filter="url(#liverNeonGlowComp)">
          <animate attributeName="r" values="36;42;36" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.14;0.26;0.14" dur="3.2s" repeatCount="indefinite" />
        </circle>

        <!-- Main Geometric Letter L -->
        <g class="logo-body-group" transform-origin="50 50">
          <!-- Filled Letter L Body -->
          <path
            d="M 28 16 
               L 46 16 
               L 46 64 
               L 76 64 
               L 76 80 
               Q 76 84 72 84 
               L 32 84 
               Q 28 84 28 80 
               Z"
            fill="url(#liverGradMainComp)"
          />

          <!-- Inner Depth Shadow -->
          <path
            d="M 28 16 
               L 36 24 
               L 36 76 
               L 72 76 
               L 76 80 
               L 32 84 
               Q 28 84 28 80 
               Z"
            fill="#0a0a0c"
            opacity="0.35"
          />

          <!-- Beveled White Highlight on Top Cut -->
          <path
            d="M 28 16 L 38 16 L 28 26 Z"
            fill="#ffffff"
            opacity="0.65"
          />

          <!-- Animated Outline Stroke with Draw-in & Glow -->
          <path
            class="animated-l-stroke"
            d="M 28 16 
               L 46 16 
               L 46 64 
               L 76 64 
               L 76 80 
               Q 76 84 72 84 
               L 32 84 
               Q 28 84 28 80 
               Z"
            fill="none"
            stroke="url(#liverGradStrokeComp)"
            stroke-width="2.5"
            stroke-linejoin="round"
            stroke-linecap="round"
          />

          <!-- Traveling Laser Beam Pulse -->
          <path
            class="animated-laser-beam"
            d="M 28 16 
               L 46 16 
               L 46 64 
               L 76 64 
               L 76 80 
               L 32 84 
               L 28 80 
               Z"
            fill="none"
            stroke="url(#liverLaserGradComp)"
            stroke-width="3"
            stroke-linecap="round"
            filter="url(#liverNeonGlowComp)"
          />

          <!-- Tech Core Accent Points -->
          <circle class="accent-dot-1" cx="74" cy="74" r="2.5" fill="#ffffff" transform-origin="74 74" />
          <circle class="accent-dot-2" cx="37" cy="24" r="1.5" fill="var(--liver-red-light, #ff9999)" transform-origin="37 24" />
        </g>
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .logo-body-group {
      animation: pulseBodyKeyframe 3s ease-in-out infinite;
    }
    .animated-l-stroke {
      stroke-dasharray: 260;
      stroke-dashoffset: 260;
      animation: drawLStroke 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards, glowLoop 3.6s ease-in-out infinite 2.2s;
    }
    .animated-laser-beam {
      stroke-dasharray: 40 180;
      animation: laserTravel 3.2s linear infinite;
    }
    .accent-dot-1 {
      animation: dotPulse 2s ease-in-out infinite;
    }
    .accent-dot-2 {
      animation: dotPulse 2s ease-in-out infinite 0.8s;
    }

    @keyframes drawLStroke {
      0% {
        stroke-dashoffset: 260;
        opacity: 0;
      }
      30% {
        opacity: 1;
      }
      100% {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }

    @keyframes glowLoop {
      0%, 100% {
        stroke-opacity: 0.7;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
      }
      50% {
        stroke-opacity: 1;
        filter: drop-shadow(0 0 8px var(--liver-red));
      }
    }

    @keyframes pulseBodyKeyframe {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 4px 12px var(--liver-red));
      }
      50% {
        transform: scale(1.02);
        filter: drop-shadow(0 4px 20px var(--liver-red-hover, var(--liver-red)));
      }
    }

    @keyframes laserTravel {
      0% {
        stroke-dashoffset: 220;
      }
      100% {
        stroke-dashoffset: -220;
      }
    }

    @keyframes dotPulse {
      0%, 100% {
        opacity: 0.4;
        transform: scale(0.9);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }
  `]
})
export class LogoComponent {
  @Input() size = 42;
}

