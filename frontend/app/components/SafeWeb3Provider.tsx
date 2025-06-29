'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Web3ContextType {
  isConnected: boolean;
  address?: string;
  connect: () => void;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export function SafeWeb3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);

          // Try to switch to MasChain network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x2BA' }], // 698 in hex
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
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask to connect your wallet.\n\nMetaMask is required to use FairLance.');
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Web3Context.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useSafeWeb3() {
  return useContext(Web3Context);
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
