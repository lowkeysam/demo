// lib/config.ts
export const config = {
  squashfeatureBaseUrl: process.env.NEXT_PUBLIC_SQUASHFEATURE_BASE_URL || 'http://localhost:3001',
  squashfeatureApiKey: process.env.NEXT_PUBLIC_SQUASHFEATURE_API_KEY || '',
} as const;

// Validate required environment variables
if (!config.squashfeatureApiKey) {
  throw new Error('NEXT_PUBLIC_SQUASHFEATURE_API_KEY is required');
}

if (!config.squashfeatureBaseUrl) {
  throw new Error('NEXT_PUBLIC_SQUASHFEATURE_BASE_URL is required');
}