'use client';

import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useSafeWeb3 } from './SafeWeb3Provider';

export function SimpleConnectButton() {
  const { isConnected, address, connect, disconnect } = useSafeWeb3();

  if (isConnected && address) {
    return (
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="web3-button"
        >
          MasChain
        </Button>
        <Button
          onClick={disconnect}
          variant="outline"
          className="web3-button"
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} className="web3-button">
      <Wallet className="mr-2 h-4 w-4" />
      Connect MasChain
    </Button>
  );
}
