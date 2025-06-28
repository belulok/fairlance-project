'use client';

import dynamic from 'next/dynamic';

const ProjectsContent = dynamic(() => import('@/app/components/ProjectsContent').then(mod => ({ default: mod.ProjectsContent })), {
  ssr: false,
  loading: () => <div className="min-h-screen gradient-bg hexagon-bg flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
});

export default function Projects() {
  return <ProjectsContent />;
}
