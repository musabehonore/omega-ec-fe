import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      screens: {
        desktop: '1440px',
        tablets: '744px',
        phone: '430px, 375px',
        xs: '325px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      colors: {
        blue: '#1fb6ff',
        'light-blue': '#F6F6F6',
        purple: '#7e5bef',
        'gray-dark': '#273444',
        gray: '#8492a6',
        'gray-light': '#d3dce6',
        star: '#EBC351',
        main: {
          100: '#E7F6F2',
          150: '#E6EDED',
          200: '#A5C9CA',
          300: '#395B64',
          400: '#2C3333'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif']
      },
      spacing: {
        1: '8px',
        2: '12px',
        3: '16px',
        4: '24px',
        5: '32px',
        6: '48px'
      },
      fontSize: {
        xxs: '0.7rem',
        '2xs': '0.4rem'
      },
      height: {
        120: '30rem',
        150: '36rem'
      },
      maxHeight: {
        120: '30rem',
        150: '36rem'
      },
      keyframes: {
        zoomIn: {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      animation: {
        zoomIn: 'zoomIn 0.3s ease-in-out'
      }
    }
  },
  darkMode: 'class',
  plugins: []
};

export default config;
