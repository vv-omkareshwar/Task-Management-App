import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano'; // For minification in production

const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    // Allow importing CSS files
    postcssImport({
      // Add any import options here
    }),
    // Use Tailwind CSS
    tailwindcss('./tailwind.config.ts'),
    // Enable modern CSS nesting
    postcssNesting(),
    // Add vendor prefixes automatically
    autoprefixer(),
    // Minify CSS in production
    isProduction && cssnano({
      preset: 'default',
    }),
  ].filter(Boolean), // Remove false values
};