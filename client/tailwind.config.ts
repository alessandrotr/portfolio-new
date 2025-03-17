import { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      dropShadow: {
        xl: '3px 0px 1px rgb(8, 44, 126)',
        '2xl': '5px 0px 1px rgb(8, 44, 126)',
        '3xl': '10px 0px 1px rgb(8, 44, 126)',
      },
      colors: {
        textDark: '#000000',
        textLight: '#ffffff',
        items: '#5fd9f9',
        borderLightTransparent: 'rgba(0,0,0,0.3)',
        borderDarkTransparent: 'rgba(255,255,255,0.1)',
        itemsHover: '#2ac0e5',
        bgDark: '#121211',
        bgDarkTransparent: 'rgba(18,18,17,0.75)',
        bgLight: '#ffffff',
        bgLightTransparent: 'rgba(239,235,232,0.75)',
      },
      backgroundColor: ({ theme }) => ({
        ...theme('colors'),
      }),
      textColor: ({ theme }) => ({
        ...theme('colors'),
      }),
      lineHeight: {
        tight: '1.2',
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
