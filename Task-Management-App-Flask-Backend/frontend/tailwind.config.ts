import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'task-new': '#3498db',
        'task-in-progress': '#f39c12',
        'task-completed': '#2ecc71',
        'task-cancelled': '#e74c3c',
      },
      // fontFamily: {
      //   // Add custom fonts here if needed
      // },
      // screens: {
      //   // Add custom breakpoints here if needed
      // },
    },
  },
  plugins: [
    // Add Tailwind plugins here if needed
  ],
}

export default config