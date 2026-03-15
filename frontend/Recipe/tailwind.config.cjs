/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
      colors: {
        brand: {
          50: '#f0f9f4',
          100: '#dcf0e4',
          200: '#bbe0cc',
          300: '#8fc7a8',
          400: '#5da87a',
          500: '#3d8c5c',
          600: '#317048',
          700: '#29593c',
          800: '#234733',
          900: '#1d3a2b',
          950: '#0d2118',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdeccc',
          200: '#fad999',
          300: '#f6be66',
          400: '#f19d33',
          500: '#ed8318',
          600: '#dc6810',
          700: '#b74f0c',
          800: '#923d0d',
          900: '#76340f',
          950: '#461a05',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Legacy alias for backward compatibility
        primary: {
          50: '#f0f9f4',
          100: '#dcf0e4',
          200: '#bbe0cc',
          300: '#8fc7a8',
          400: '#5da87a',
          500: '#3d8c5c',
          600: '#317048',
          700: '#29593c',
          800: '#234733',
          900: '#1d3a2b',
          950: '#0d2118',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-h1': 'clamp(2rem, 5vw, 3.5rem)',
        'fluid-h2': 'clamp(1.5rem, 4vw, 2.5rem)',
        'fluid-h3': 'clamp(1.25rem, 3vw, 2rem)',
        'fluid-body': 'clamp(1rem, 2vw, 1.125rem)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Elevation system
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        'elevation-3': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        'elevation-4': '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
        'elevation-5': '0 25px 50px rgba(0,0,0,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
