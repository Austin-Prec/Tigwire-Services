/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark blue — same structural role the old navy scale played
        // (headings, hero/footer gradients, primary text on light
        // surfaces), retuned slightly cooler and a touch deeper.
        navy: {
          DEFAULT: '#152A4A',
          50: '#E7EBF2',
          100: '#C2CCDE',
          200: '#8598B8',
          300: '#4C6389',
          400: '#25406B',
          500: '#152A4A',
          600: '#101F38',
          700: '#0B1626',
          800: '#060D17',
          900: '#02060B',
        },
        // Near-black — used where the old palette used pure black-ish
        // tones (deepest gradient stops, high-contrast text). Kept as
        // its own scale rather than folding into navy-900, since a
        // true near-black reads differently than a very dark blue.
        charcoal: {
          DEFAULT: '#15181A',
          50: '#EAEBEC',
          100: '#C7CACD',
          200: '#8E9498',
          300: '#5B6266',
          400: '#33383B',
          500: '#15181A',
          600: '#101214',
          700: '#0B0C0E',
          800: '#060708',
          900: '#020202',
        },
        // Sage green — primary accent, replacing crimson in every role
        // crimson used to play (CTAs, links, active states, icon tints).
        sage: {
          DEFAULT: '#5C7A5E',
          50: '#EDF2ED',
          100: '#D2DFD2',
          200: '#A6C0A8',
          300: '#7FA182',
          400: '#5C7A5E',
          500: '#48624A',
          600: '#374B39',
          700: '#263429',
          800: '#161E17',
          900: '#0A0D0A',
        },
        // Clay — secondary complementary accent, replacing gold's role
        // (badges, subtle highlight backgrounds, warm counterpoint to
        // navy/sage). A warm muted terracotta rather than metallic gold,
        // to sit quietly next to sage instead of competing with it.
        clay: {
          DEFAULT: '#B5754A',
          50: '#F5E9DF',
          100: '#E8CDB4',
          200: '#D6A87C',
          300: '#C68F5C',
          400: '#B5754A',
          500: '#93602F',
          600: '#734A24',
          700: '#52351A',
          800: '#2E1E0E',
          900: '#170F07',
        },
      },
      fontFamily: {
        garamond: ['Garamond', 'EB Garamond', 'Georgia', 'serif'],
        arial: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.600'),
            '--tw-prose-headings': theme('colors.navy.500'),
            '--tw-prose-links': theme('colors.sage.400'),
            '--tw-prose-bold': theme('colors.navy.500'),
            '--tw-prose-quotes': theme('colors.navy.400'),
            '--tw-prose-quote-borders': theme('colors.sage.200'),
            fontFamily: theme('fontFamily.arial').join(', '),
            h1: { fontFamily: theme('fontFamily.garamond').join(', ') },
            h2: { fontFamily: theme('fontFamily.garamond').join(', ') },
            h3: { fontFamily: theme('fontFamily.garamond').join(', ') },
            h4: { fontFamily: theme('fontFamily.garamond').join(', ') },
            img: { borderRadius: theme('borderRadius.lg') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
