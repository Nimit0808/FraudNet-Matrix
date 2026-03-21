/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enterprise: {
          navy: '#F8FAFC', // Changed to light slate-50
          charcoal: '#FFFFFF', // Clean white panels
          slate: '#E2E8F0', // slate-200 borders
          textPrimary: '#0F172A', // slate-900 text
          textSecondary: '#64748B', // slate-500 text
        },
        status: {
          crimson: '#DC2626', // Red 600
          amber: '#D97706',   // Amber 600
          emerald: '#059669', // Emerald 600
          blue: '#2563EB',    // Blue 600
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
