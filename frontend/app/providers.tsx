'use client';

import '@rainbow-me/rainbowkit/styles.css';
import * as React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import wagmi components to avoid SSR issues
const WagmiProviderComponent = dynamic(
  () => import('./WagmiProviderComponent'),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderComponent>
      {children}
    </WagmiProviderComponent>
  );
}