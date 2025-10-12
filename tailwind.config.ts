import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        'huge': '96px',
        'mega': '72px',
      },
      colors: {
        // Modern gradient colors
        'quiz-bg': '#0f0f23',
        'quiz-text': '#ffffff',
        'quiz-correct': '#10b981',
        'quiz-wrong': '#f43f5e',
        'quiz-neutral': '#6366f1',
        'quiz-highlight': '#f59e0b',
        'quiz-purple': '#a855f7',
        'quiz-cyan': '#06b6d4',
        'quiz-pink': '#ec4899',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-quiz': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-correct': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-wrong': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
        'gradient-neutral': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-green': '0 0 30px rgba(16, 185, 129, 0.6)',
        'glow-red': '0 0 30px rgba(244, 63, 94, 0.6)',
        'glow-yellow': '0 0 30px rgba(245, 158, 11, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;

