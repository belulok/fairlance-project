'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MasChainConnectButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showNetworkBadge?: boolean;
  redirectToMasChain?: boolean;
}

export function MasChainConnectButton({
  className = "",
  variant = 'default',
  size = 'default',
  showNetworkBadge = true,
  redirectToMasChain = true
}: MasChainConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkMasChainConnection();

    // Listen for wallet connection events
    const handleWalletConnection = () => {
      checkMasChainConnection();
    };

    window.addEventListener('maschain-wallet-connected', handleWalletConnection);

    // Also check periodically in case localStorage was updated
    const interval = setInterval(checkMasChainConnection, 2000);

    return () => {
      window.removeEventListener('maschain-wallet-connected', handleWalletConnection);
      clearInterval(interval);
    };
  }, []);

  const checkMasChainConnection = () => {
    // Check if user has a MasChain wallet stored in localStorage
    const masChainWallet = localStorage.getItem('maschain_wallet');
    if (masChainWallet) {
      try {
        const walletData = JSON.parse(masChainWallet);
        if (walletData.address) {
          setIsConnected(true);
          setAddress(walletData.address);
        }
      } catch (error) {
        console.error('Error parsing MasChain wallet data:', error);
      }
    }
  };

  const handleConnectClick = () => {
    if (redirectToMasChain) {
      router.push('/maschain');
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('maschain_wallet');
    setIsConnected(false);
    setAddress('');
  };

  if (!mounted) {
    return (
      <Button disabled className={className} variant={variant} size={size}>
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex gap-2">
        {showNetworkBadge && (
          <Button
            variant="outline"
            size={size}
            className="text-green-500 border-green-500 hover:bg-green-50"
            asChild
          >
            <Link href="/maschain" className="flex items-center gap-1">
              MasChain
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        )}
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size={size}
          className={className}
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnectClick}
      className={className}
      variant={variant}
      size={size}
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect MasChain
    </Button>
  );
}


