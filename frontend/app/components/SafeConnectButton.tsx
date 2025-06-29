'use client';

import { useState, useEffect } from 'react';
import { ConnectWalletButton } from './ConnectWalletButton';
import { SimpleConnectButton } from './SimpleConnectButton';
import { MetaMaskConnectButton } from './MetaMaskConnectButton';

export function SafeConnectButton() {
  const [mounted, setMounted] = useState(false);
  const [useMetaMask, setUseMetaMask] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if we should use MetaMask directly
    if (typeof window !== 'undefined' && window.ethereum && !window.ethereum.isConnected) {
      setUseMetaMask(true);
    }
  }, []);

  if (!mounted) {
    return <MetaMaskConnectButton />;
  }

  // Always use MetaMask for now to avoid RainbowKit issues
  return <MetaMaskConnectButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" />;
}
