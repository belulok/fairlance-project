import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

// Define MasChain configuration
const maschain = {
  id: 698,
  name: 'MasChain',
  nativeCurrency: {
    decimals: 18,
    name: 'MAS',
    symbol: 'MAS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.maschain.com'],
    },
  },
  blockExplorers: {
    default: { name: 'MasChain Explorer', url: 'https://explorer.maschain.com' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'FairLance',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [maschain, mainnet, polygon, optimism, arbitrum, base],
  connectors: [
    injected(),
    metaMask(),
  ],
  ssr: false, // Important for Next.js App Router
});
