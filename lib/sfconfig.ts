// lib/config.ts
export const config = {
  squashfeatureApiKey: process.env.NEXT_PUBLIC_SQUASHFEATURE_API_KEY || '',
  squashfeatureBaseUrl: process.env.NEXT_PUBLIC_SQUASHFEATURE_BASE_URL || 'http://localhost:3001',
  squashfeatureProjectId: process.env.NEXT_PUBLIC_SQUASHFEATURE_PROJECT_ID || ''
};

// Validate required environment variables
if (!config.squashfeatureApiKey) {
  throw new Error('NEXT_PUBLIC_SQUASHFEATURE_API_KEY is required');
}

if (!config.squashfeatureBaseUrl) {
  throw new Error('NEXT_PUBLIC_SQUASHFEATURE_BASE_URL is required');
}

if (!config.squashfeatureProjectId) {
  throw new Error('NEXT_PUBLIC_SQUASHFEATURE_PROJECT_ID is required');
}