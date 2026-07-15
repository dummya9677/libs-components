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
          inverse: 'var(--color-text-inverse)',
        },
        status: {
          success: 'var(--color-success)',
          'success-soft': 'var(--color-success-soft)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
        },
        chat: {
          user: 'var(--color-chat-user)',
          bot: 'var(--color-chat-bot)',
          progress: 'var(--color-progress)',
        },
        promo: {
          DEFAULT: 'var(--color-promo)',
          button: 'var(--color-promo-button)',
        },
        banner: {
          DEFAULT: 'var(--color-banner)',
          text: 'var(--color-banner-text)',
        },
        agent: {
          ticket: 'var(--color-agent-ticket)',
          'ticket-soft': 'var(--color-agent-ticket-soft)',
          impact: 'var(--color-agent-impact)',
          'impact-soft': 'var(--color-agent-impact-soft)',
          data: 'var(--color-agent-data)',
          'data-soft': 'var(--color-agent-data-soft)',
          knowledge: 'var(--color-agent-knowledge)',
          'knowledge-soft': 'var(--color-agent-knowledge-soft)',
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
        sidebar: '220px',
        'sidebar-collapsed': '72px',
        chat: '300px',
        'chat-lg': '320px',
      },
      maxWidth: {
        chat: '320px',
      },
      screens: {
        xs: '480px',
      },

    },
  },
  plugins: [],
};
