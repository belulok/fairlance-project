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
  RefreshCw,
  User,
  Shield,
  Plus,
  Send,
  Coins
} from 'lucide-react';

interface MasChainWallet {
  wallet_id: number;
  wallet_name: string;
  wallet_address: string;
  wallet_type: string;
  is_active: number;
  balance?: string;
}

interface UserData {
  name: string;
  email: string;
  phone?: string;
  ic?: string;
}

export function MasChainWalletManager() {
  const [wallets, setWallets] = useState<MasChainWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<MasChainWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    ic: '',
    walletName: ''
  });

  const [transferForm, setTransferForm] = useState({
    toAddress: '',
    amount: '',
    tokenContract: ''
  });

  useEffect(() => {
    // Load existing wallets if user is logged in
    loadUserWallets();

    // Check if there's already a wallet stored in localStorage
    const storedWallet = localStorage.getItem('maschain_wallet');
    if (storedWallet) {
      try {
        const walletData = JSON.parse(storedWallet);
        // Create a wallet object from stored data
        const wallet: MasChainWallet = {
          wallet_id: walletData.wallet_id,
          wallet_name: walletData.wallet_name,
          wallet_address: walletData.address,
          wallet_type: 'user', // default type
          is_active: walletData.is_active
        };
        setSelectedWallet(wallet);
        setWallets([wallet]); // Add to wallets list
      } catch (error) {
        console.error('Error parsing stored wallet data:', error);
      }
    }
  }, []);

  const loadUserWallets = async () => {
    // This would typically load wallets associated with the logged-in user
    // For now, we'll just clear the state
    setWallets([]);
    setSelectedWallet(null);
  };

  const clearWallet = () => {
    localStorage.removeItem('maschain_wallet');
    setSelectedWallet(null);
    setWallets([]);
  };

  const createWallet = async () => {
    if (!userForm.name || !userForm.email) {
      setError('Name and email are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/api/maschain/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('MasChain wallet created successfully!');
        
        // Add the new wallet to our list
        if (data.data && data.data.result && data.data.result.wallet) {
          const walletData = data.data.result.wallet;
          const newWallet: MasChainWallet = {
            wallet_id: walletData.wallet_id,
            wallet_name: walletData.wallet_name,
            wallet_address: walletData.wallet_address,
            wallet_type: walletData.wallet_type,
            is_active: walletData.is_active
          };

          setWallets(prev => [...prev, newWallet]);
          setSelectedWallet(newWallet);

          // Store wallet in localStorage for other components to detect
          const walletDataToStore = {
            address: newWallet.wallet_address,
            wallet_id: newWallet.wallet_id,
            wallet_name: newWallet.wallet_name,
            is_active: newWallet.is_active
          };

          console.log('WalletManager: Storing wallet data:', walletDataToStore);
          localStorage.setItem('maschain_wallet', JSON.stringify(walletDataToStore));

          // Verify it was stored
          const stored = localStorage.getItem('maschain_wallet');
          console.log('WalletManager: Verified stored data:', stored);

          // Dispatch custom event to notify other components
          console.log('WalletManager: Dispatching maschain-wallet-connected event');
          window.dispatchEvent(new CustomEvent('maschain-wallet-connected'));
        }
        
        // Clear form
        setUserForm({ name: '', email: '', phone: '', ic: '', walletName: '' });
      } else {
        setError(data.message || 'Failed to create wallet');
      }
    } catch (error: any) {
      setError('Failed to create wallet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getWalletBalance = async (walletId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/maschain/wallet/balance/${walletId}`);
      const data = await response.json();
      
      if (data.success) {
        // Update wallet balance in state
        setWallets(prev => prev.map(w => 
          w.wallet_id === walletId 
            ? { ...w, balance: data.data.balance || '0' }
            : w
        ));
      }
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const mintTokens = async (walletId: number, amount: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/maschain/token/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId,
          amount,
          tokenContract: 'default' // Use default token contract
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully minted ${amount} tokens!`);
        // Refresh balance
        await getWalletBalance(walletId);
      } else {
        setError(data.message || 'Failed to mint tokens');
      }
    } catch (error: any) {
      setError('Failed to mint tokens: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const transferTokens = async () => {
    if (!selectedWallet || !transferForm.toAddress || !transferForm.amount) {
      setError('Please fill in all transfer fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/maschain/token/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromWalletId: selectedWallet.wallet_id,
          toAddress: transferForm.toAddress,
          amount: transferForm.amount,
          tokenContract: transferForm.tokenContract || 'default'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully transferred ${transferForm.amount} tokens!`);
        setTransferForm({ toAddress: '', amount: '', tokenContract: '' });
        // Refresh balance
        await getWalletBalance(selectedWallet.wallet_id);
      } else {
        setError(data.message || 'Failed to transfer tokens');
      }
    } catch (error: any) {
      setError('Failed to transfer tokens: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setSuccess('Address copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Create Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create MasChain Wallet
          </CardTitle>
          <CardDescription>
            Create a new wallet managed by MasChain (no MetaMask required)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <div>
            <Label htmlFor="walletName">Wallet Name (Optional)</Label>
            <Input
              id="walletName"
              value={userForm.walletName}
              onChange={(e) => setUserForm(prev => ({ ...prev, walletName: e.target.value }))}
              placeholder="Custom wallet name"
            />
          </div>
          
          <Button 
            onClick={createWallet} 
            disabled={isLoading || !userForm.name || !userForm.email}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Create MasChain Wallet
          </Button>
        </CardContent>
      </Card>

      {/* Wallet List */}
      {wallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Your MasChain Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallets.map((wallet) => (
              <div 
                key={wallet.wallet_id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedWallet?.wallet_id === wallet.wallet_id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedWallet(wallet);
                  // Store wallet in localStorage for other components to detect
                  localStorage.setItem('maschain_wallet', JSON.stringify({
                    address: wallet.wallet_address,
                    wallet_id: wallet.wallet_id,
                    wallet_name: wallet.wallet_name,
                    is_active: wallet.is_active
                  }));

                  // Dispatch custom event to notify other components
                  window.dispatchEvent(new CustomEvent('maschain-wallet-connected'));
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{wallet.wallet_name}</h4>
                  <Badge variant={wallet.is_active ? "default" : "secondary"}>
                    {wallet.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <code className="bg-background px-2 py-1 rounded text-xs">
                    {wallet.wallet_address}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyAddress(wallet.wallet_address);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>

                {wallet.balance && (
                  <div className="mt-2 text-sm">
                    Balance: <span className="font-medium">{wallet.balance} MAS</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      getWalletBalance(wallet.wallet_id);
                    }}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      mintTokens(wallet.wallet_id, '100');
                    }}
                    disabled={isLoading}
                  >
                    <Coins className="w-3 h-3 mr-1" />
                    Mint 100
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Token Transfer */}
      {selectedWallet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Transfer Tokens
            </CardTitle>
            <CardDescription>
              Transfer tokens from {selectedWallet.wallet_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="toAddress">To Address</Label>
              <Input
                id="toAddress"
                value={transferForm.toAddress}
                onChange={(e) => setTransferForm(prev => ({ ...prev, toAddress: e.target.value }))}
                placeholder="0x..."
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={transferForm.amount}
                onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
              />
            </div>
            
            <Button 
              onClick={transferTokens} 
              disabled={isLoading || !transferForm.toAddress || !transferForm.amount}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Transfer Tokens
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MasChainWalletManager;
