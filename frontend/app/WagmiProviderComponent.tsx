'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// For demo purposes, we'll use Sepolia testnet as a proxy for MasChain
// In production, this would be replaced with actual MasChain configuration
// when MasChain provides official wagmi/viem support

// Use a default project ID for development, but allow override through env
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd';
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'FairLance';

const config = getDefaultConfig({
  appName,
  projectId,
  chains: [sepolia], // Using Sepolia as MasChain proxy for demo
  ssr: false, // Disable SSR to avoid hydration issues
});

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function WagmiProviderComponent({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
