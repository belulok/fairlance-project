'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { SafeWeb3Provider } from './components/SafeWeb3Provider';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <SafeWeb3Provider>
        {children}
      </SafeWeb3Provider>
    );
  }

  // Try to use full Web3 stack, fallback to simple provider
  try {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <SafeWeb3Provider>
              {children}
            </SafeWeb3Provider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.warn('Full Web3 stack failed, using fallback:', error);
    return (
      <SafeWeb3Provider>
        {children}
      </SafeWeb3Provider>
    );
  }
}