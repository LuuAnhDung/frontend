// Production
// Development
// export const BACKEND_URL = process.env.BACKEND_URL; // local API URL
// backend-domain.ts
const BACKEND_API: string = process.env.NODE_ENV === 'development'
  ? 'https://educobackend.azurewebsites.net/' // Local or Development API URL
  : process.env.BACKEND_URL || 'https://educobackend.azurewebsites.net/';

  export const BACKEND_URL = BACKEND_API