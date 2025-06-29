'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle } from 'lucide-react';

interface MetaMaskConnectButtonProps {
  className?: string;
}

export function MetaMaskConnectButton({ className }: MetaMaskConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;

    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);

        // Try to add/switch to MasChain network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2BA' }], // 698 in hex (MasChain)
          });
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x2BA',
                  chainName: 'MasChain',
                  nativeCurrency: {
                    name: 'MAS',
                    symbol: 'MAS',
                    decimals: 18,
                  },
                  rpcUrls: ['https://rpc.maschain.com'],
                  blockExplorerUrls: ['https://explorer.maschain.com'],
                }],
              });
            } catch (addError) {
              console.error('Failed to add MasChain network:', addError);
              // Continue anyway - user can switch manually
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setError('');
  };

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className={className}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="text-green-500 border-green-500"
        >
          MasChain
        </Button>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className={className}
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className={className}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
