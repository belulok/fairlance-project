'use client';

import { useState, useEffect } from 'react';
import { ConnectWalletButton } from './ConnectWalletButton';
import { SimpleConnectButton } from './SimpleConnectButton';

export function SafeConnectButton() {
  const [mounted, setMounted] = useState(false);
  const [useSimple, setUseSimple] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SimpleConnectButton />;
  }

  if (useSimple) {
    return <SimpleConnectButton />;
  }

  try {
    return <ConnectWalletButton />;
  } catch (error) {
    console.warn('ConnectWalletButton failed, using simple version:', error);
    // Set useSimple to true to avoid repeated errors
    setUseSimple(true);
    return <SimpleConnectButton />;
  }
}
