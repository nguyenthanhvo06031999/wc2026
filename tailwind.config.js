export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#080C12',
        surface: '#0F1520',
        subtle:  '#1E2736',
        gold:    '#F5A623',
        muted:   '#64748B',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
