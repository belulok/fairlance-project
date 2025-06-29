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
  RefreshCw
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
            {walletAddress ? (
              <div>
                <Label>Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {walletAddress}
                  </code>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  No wallet found. Create one to get started.
                </p>
                <Button onClick={handleCreateWallet} disabled={isLoading}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Create Wallet
                </Button>
              </div>
            )}
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
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Token features will be available after wallet creation and KYC verification.
              </p>
              <Button variant="outline" disabled>
                <Coins className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
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
