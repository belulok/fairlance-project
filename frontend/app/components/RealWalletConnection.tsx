'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  Copy,
  ExternalLink,
  RefreshCw,
  User,
  Shield
} from 'lucide-react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isRegistered: boolean;
  userData: any;
}

export function RealWalletConnection() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    isRegistered: false,
    userData: null
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    ic: ''
  });

  // MasChain Testnet Configuration
  const MASCHAIN_CONFIG = {
    chainId: '0x2BA', // 698 in hex
    chainName: 'MasChain Testnet',
    nativeCurrency: {
      name: 'MAS',
      symbol: 'MAS',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-testnet.maschain.com'],
    blockExplorerUrls: ['https://explorer-testnet.maschain.com'],
  };

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        if (accounts.length > 0) {
          setWallet(prev => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
            chainId: parseInt(chainId, 16)
          }));
          
          await getBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWallet({
        isConnected: false,
        address: null,
        chainId: null,
        balance: null,
        isRegistered: false,
        userData: null
      });
    } else {
      setWallet(prev => ({ ...prev, address: accounts[0] }));
      getBalance(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
  };

  const connectWallet = async () => {
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
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWallet(prev => ({
          ...prev,
          isConnected: true,
          address: accounts[0],
          chainId: parseInt(chainId, 16)
        }));

        await getBalance(accounts[0]);
        await switchToMasChain();
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToMasChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MASCHAIN_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MASCHAIN_CONFIG],
          });
        } catch (addError) {
          console.error('Failed to add MasChain network:', addError);
        }
      }
    }
  };

  const getBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      // Convert from wei to ether
      const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
      setWallet(prev => ({ ...prev, balance: balanceInEther.toFixed(4) }));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const registerWithMasChain = async () => {
    if (!wallet.address || !userForm.name || !userForm.email) {
      setError('Please fill in required fields (Name and Email)');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/maschain/wallet/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          ic: userForm.ic,
          walletAddress: wallet.address,
          walletName: `${userForm.name}_Wallet`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWallet(prev => ({ 
          ...prev, 
          isRegistered: true, 
          userData: data.data 
        }));
        setUserForm({ name: '', email: '', phone: '', ic: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register with MasChain');
      }
    } catch (error: any) {
      setError('Failed to register with MasChain: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      isRegistered: false,
      userData: null
    });
    setError('');
  };

  const isOnMasChain = wallet.chainId === 698; // MasChain testnet chain ID

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to interact with MasChain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!wallet.isConnected ? (
            <div className="text-center py-6">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Connect your wallet to get started with FairLance
              </p>
              <Button onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4 mr-2" />
                )}
                Connect MetaMask
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Wallet Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Wallet Address</span>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {wallet.address}
                </code>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Balance</span>
                    <div className="font-medium">{wallet.balance} MAS</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Network</span>
                    <div className="flex items-center gap-1">
                      {isOnMasChain ? (
                        <Badge className="bg-green-500">MasChain</Badge>
                      ) : (
                        <Badge variant="outline">Chain {wallet.chainId}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!isOnMasChain && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 mb-2">
                    Please switch to MasChain Testnet for full functionality
                  </p>
                  <Button size="sm" onClick={switchToMasChain}>
                    Switch to MasChain
                  </Button>
                </div>
              )}

              {/* MasChain Registration */}
              {isOnMasChain && !wallet.isRegistered && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Register with MasChain
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete your profile to access all FairLance features
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={userForm.name}
                          onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={userForm.phone}
                          onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ic">ID Number</Label>
                        <Input
                          id="ic"
                          value={userForm.ic}
                          onChange={(e) => setUserForm(prev => ({ ...prev, ic: e.target.value }))}
                          placeholder="Enter your ID number"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={registerWithMasChain} 
                      disabled={isConnecting || !userForm.name || !userForm.email}
                      className="w-full mt-4"
                    >
                      {isConnecting ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      Register with MasChain
                    </Button>
                  </div>
                </div>
              )}

              {/* Registered Status */}
              {wallet.isRegistered && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Successfully registered with MasChain!</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={disconnectWallet}>
                  Disconnect
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`https://explorer-testnet.maschain.com/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
