'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Wallet,
  Shield,
  Coins,
  FileContract,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Users
} from 'lucide-react';
import { useMasChain } from '@/app/services/maschain';

export function MasChainDashboard() {
  const {
    isConnected,
    isLoading,
    error,
    walletAddress,
    kycStatus,
    createWallet,
    initiateKYC,
    refreshStatus
  } = useMasChain();

  const [kycForm, setKycForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [demoData, setDemoData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState('0.00');

  // Demo wallet address for testing
  const demoWalletAddress = '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4';

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      // Load demo data
      const response = await fetch('http://localhost:5001/api/maschain/demo/data');
      if (response.ok) {
        const data = await response.json();
        setDemoData(data.data);
      }

      // Load demo transactions
      const txResponse = await fetch(`http://localhost:5001/api/maschain/wallet/transactions/${demoWalletAddress}`);
      if (txResponse.ok) {
        const txData = await txResponse.json();
        setTransactions(txData.data || []);
      }

      // Set demo wallet balance
      setWalletBalance('1,250.75');
    } catch (error) {
      console.error('Failed to load demo data:', error);
    }
  };

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      alert('Wallet creation initiated! Check your email for updates.');
    } catch (error: any) {
      alert(`Failed to create wallet: ${error.message}`);
    }
  };

  const handleInitiateKYC = async () => {
    try {
      await initiateKYC(kycForm);
      alert('KYC process initiated! Check your email for next steps.');
      setKycForm({ fullName: '', email: '', phone: '' });
    } catch (error: any) {
      alert(`Failed to initiate KYC: ${error.message}`);
    }
  };

  const getKYCStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getConnectionStatusBadge = () => {
    if (isLoading) {
      return <Badge className="bg-blue-500"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Connecting</Badge>;
    }
    if (isConnected) {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
    }
    return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">MasChain Integration</h2>
          <p className="text-muted-foreground">
            Manage your blockchain wallet, KYC, and smart contracts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getConnectionStatusBadge()}
          <Button variant="outline" size="sm" onClick={refreshStatus}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Management
            </CardTitle>
            <CardDescription>
              Create and manage your MasChain wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Demo Wallet Display */}
            <div className="space-y-4">
              <div>
                <Label>Demo Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                    {demoWalletAddress}
                  </code>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Balance</div>
                  <div className="text-lg font-bold text-green-700">{walletBalance} MAS</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Transactions</div>
                  <div className="text-lg font-bold text-blue-700">{transactions.length}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateWallet} disabled={isLoading} size="sm">
                  <Wallet className="w-4 h-4 mr-2" />
                  Create New Wallet
                </Button>
                <Button variant="outline" onClick={loadDemoData} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              KYC Verification
            </CardTitle>
            <CardDescription>
              Complete identity verification for enhanced features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              {getKYCStatusBadge()}
            </div>

            {kycStatus === 'not_started' && (
              <div className="space-y-3">
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={kycForm.fullName}
                    onChange={(e) => setKycForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={kycForm.email}
                    onChange={(e) => setKycForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={kycForm.phone}
                    onChange={(e) => setKycForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <Button 
                  onClick={handleInitiateKYC} 
                  disabled={isLoading || !kycForm.fullName || !kycForm.email || !kycForm.phone}
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Start KYC Process
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Token Management
            </CardTitle>
            <CardDescription>
              Manage skill tokens and payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">SKILL Tokens</div>
                <div className="text-lg font-bold text-purple-700">75.50</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Earned This Month</div>
                <div className="text-lg font-bold text-orange-700">225.75 MAS</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Transfer</Label>
              <div className="flex gap-2">
                <Input placeholder="Recipient address" className="flex-1" />
                <Input placeholder="Amount" className="w-24" />
                <Button size="sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Contracts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileContract className="w-5 h-5" />
              Smart Contracts
            </CardTitle>
            <CardDescription>
              Escrow contracts for secure project payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Smart contract features will be available after wallet creation and KYC verification.
              </p>
              <Button variant="outline" disabled>
                <FileContract className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Your latest blockchain transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.from_wallet === demoWalletAddress
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {tx.from_wallet === demoWalletAddress ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.type === 'project_payment' ? 'Project Payment' :
                         tx.type === 'skill_token_transfer' ? 'Skill Token Transfer' :
                         'Token Transfer'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      tx.from_wallet === demoWalletAddress ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {tx.from_wallet === demoWalletAddress ? '-' : '+'}
                      {tx.amount} {tx.currency}
                    </div>
                    <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>

          {transactions.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Transactions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Access MasChain resources and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://portal-testnet.maschain.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                MasChain Portal
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://explorer-testnet.maschain.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Block Explorer
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://docs.maschain.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
