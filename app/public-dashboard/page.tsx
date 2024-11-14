// app/public-dashboard/page.tsx
'use client'

import { useSearchParams } from 'next/navigation';
import SelfHostedDashboard from '@/components/SelfHostedDashboard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { config } from '@/lib/sfconfig';

function DashboardContent() {
  const searchParams = useSearchParams();
  // Use URL parameter if available, otherwise fall back to env variable
  const projectId = searchParams.get('name') || config.squashfeatureProjectId;

  if (!projectId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No project id provided. Add to URL (?name=your-project-id) or set NEXT_PUBLIC_SQUASHFEATURE_PROJECT_ID in .env.local
      </div>
    );
  }

  return (
    <SelfHostedDashboard 
      apiKey={config.squashfeatureApiKey}
      baseUrl={config.squashfeatureBaseUrl}
      projectId={projectId}
    />
  );
}

export default function PublicDashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}