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
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet');
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
