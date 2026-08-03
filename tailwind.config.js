/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        logo: 'var(--color-logo)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          dark: 'var(--color-brand-dark)',
          soft: 'var(--color-brand-soft)',
        },
        client: {
          primary: 'var(--color-client-primary-blue)',
          'blue-helix-dark': 'var(--color-blue-helix-dark)',
          'cyan-helix-light': 'var(--color-cyan-helix-light)',
          'cyan-30': 'var(--color-cyan-30)',
          'cyan-10': 'var(--color-cyan-10)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        app: {
          bg: 'var(--color-background)',
          border: 'var(--color-border)',
          'border-light': 'var(--color-border-light)',
        },
        ink: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        status: {
          success: 'var(--color-success)',
          'success-soft': 'var(--color-success-soft)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
        },
        banner: {
          DEFAULT: 'var(--color-banner)',
          text: 'var(--color-banner-text)',
        },
        feature: {
          purple: 'var(--color-feature-purple)',
          blue: 'var(--color-feature-blue)',
          green: 'var(--color-feature-green)',
          orange: 'var(--color-feature-orange)',
          yellow: 'var(--color-feature-yellow)',
          gold: 'var(--color-feature-gold)',
        },
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        panel: '0 0 0 1px rgb(15 23 42 / 0.04)',
      },
      width: {
        sidebar: '260px',
        'home-rail': '272px',
      },
      screens: {
        xs: '480px',
      },

    },
  },
  plugins: [],
};
