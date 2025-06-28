'use client';

import { useState, useEffect } from 'react';
import { ConnectWalletButton } from './ConnectWalletButton';

export function ClientOnlyConnectButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-primary/10 animate-pulse rounded-md"></div>
    );
  }

  return <ConnectWalletButton />;
}
