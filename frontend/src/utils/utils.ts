// Dynamic API domain based on environment
export const APIDomain = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Environment check
export const isProduction = import.meta.env.VITE_APP_ENV === 'production';
export const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

