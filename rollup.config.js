import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import { glob } from 'glob';

// Get all TypeScript/TSX files that should be built individually
const componentFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: [
    'src/**/*.test.{ts,tsx}',
    'src/**/*.d.ts',
    'src/index.ts', // Exclude main entry point
    'src/app/**/*', // Exclude Next.js app files
    'src/foundations/tokens/*.js' // Exclude token JS files
  ]
});

// Create input object for individual files
const componentInput = {};
componentFiles.forEach(file => {
  // Remove src/ prefix and file extension for the key
  const key = file.replace('src/', '').replace(/\.(ts|tsx)$/, '');
  componentInput[key] = file;
});

// Common plugins configuration
const getPlugins = (tsconfig = './tsconfig.build.json') => [
  peerDepsExternal(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    preferBuiltins: false,
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig,
    exclude: ['**/*.test.ts', '**/*.test.tsx'],
    jsx: 'react',
    outputToFilesystem: true,
  }),
  postcss({
    modules: false,
    extract: 'styles/globals.css', // Changed from 'styles.css' to match package.json exports
    minimize: true,
    // Ensure PostCSS processes the CSS with the config file
    config: {
      path: './postcss.config.js'
    },
    // Process @import statements
    use: ['sass'],
  }),
  copy({
    targets: [
      { src: 'tailwind.preset.cjs', dest: 'dist' },
      // Don't copy the raw styles directory as it will overwrite processed CSS
      // { src: 'src/styles', dest: 'dist' }, // Removed this line
      { src: 'src/foundations/tokens/*.js', dest: 'dist/foundations/tokens' },
    ],
  }),
];

// External dependencies - keep minimal for framework-agnostic approach
const external = (id) => {
  return (
    id === 'react' ||
    id === 'react-dom' ||
    id.startsWith('react/') ||
    id.startsWith('react-dom/') ||
    id.startsWith('@heroicons/react')
  );
};

export default [
  // Main bundle entry point
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: getPlugins(),
    external,
  },
  // Individual component files
  {
    input: componentInput,
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].js',
      },
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].cjs',
        exports: 'auto',
      },
    ],
    plugins: getPlugins(),
    external,
  },
];
