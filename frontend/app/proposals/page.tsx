'use client';

import dynamic from 'next/dynamic';

const ProposalsContent = dynamic(() => import('@/app/components/ProposalsContent').then(mod => ({ default: mod.ProposalsContent })), {
  ssr: false,
  loading: () => <div className="min-h-screen gradient-bg hexagon-bg flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
});

export default function Proposals() {
  return <ProposalsContent />;
}