/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          void: '#02040a',
          dark: '#030712',
          card: '#070b18',
          panel: '#090e21',
          border: '#15203b',
          borderBright: '#1e325c',
          cyan: '#00f5ff',
          neonCyan: '#06b6d4',
          neonPurple: '#a855f7',
          neonGreen: '#00ff88',
          neonRose: '#ff2a6d',
          neonAmber: '#fbbf24',
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          900: '#164e63',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        cyber: ['"Orbitron"', 'sans-serif'],
        tech: ['"Rajdhani"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.45)',
        'neon-purple': '0 0 20px -2px rgba(168, 85, 247, 0.45)',
        'neon-green': '0 0 20px -2px rgba(0, 255, 136, 0.45)',
        'cyber-panel': '0 10px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px -5px rgba(6, 182, 212, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
