/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blauw: '#1a1a2e',
        magenta: '#C2185B',
        grijs: '#6b7280',
        'bg-alt': '#f8f9fa',
        lijn: '#e5e7eb',
        'magenta-licht': '#fce4ec',
      },
    },
  },
  plugins: [],
};
