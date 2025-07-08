// Import CSS for PostCSS processing
import './styles/globals.css';

// Foundations
export * from './foundations';

// Components - SSR-safe by default, client components marked with 'use client'
export * from './components';

// Layout - Mixed SSR/Client components
export * from './layout';

// Tabular Data - Client-side components
export * from './tabularData';

// Types - SSR-safe
export * from './types'; 