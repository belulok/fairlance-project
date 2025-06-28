'use client';

import * as React from 'react';

// Simplified provider for demo - no RainbowKit to avoid build issues
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}