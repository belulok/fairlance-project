'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  Award, 
  Shield, 
  TrendingUp, 
  DollarSign,
  Clock,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { MasChainConnectButton } from '@/app/components/MasChainConnectButton';
import { KYCVerification } from '@/app/components/KYCVerification';
import { SkillTokenDashboard } from '@/app/components/SkillTokenDashboard';
import { ProofOfWorkSubmission } from '@/app/components/ProofOfWorkSubmission';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userStats, setUserStats] = useState({
    projectsCompleted: 12,
    totalEarnings: 2450,
    averageRating: 4.8,
    trustScore: 85,
    kycStatus: 'verified' as const,
    skillTokens: 3,
    trustNFTs: 8
  });

  useEffect(() => {
    setMounted(true);

    const checkMasChainConnection = () => {
      console.log('Dashboard: Checking MasChain connection...');
      const masChainWallet = localStorage.getItem('maschain_wallet');
      console.log('Dashboard: Retrieved wallet data:', masChainWallet);

      if (masChainWallet) {
        try {
          const walletData = JSON.parse(masChainWallet);
          console.log('Dashboard: Parsed wallet data:', walletData);

          if (walletData.address) {
            console.log('Dashboard: Setting connected to true with address:', walletData.address);
            setIsConnected(true);
            setAddress(walletData.address);
          } else {
            console.log('Dashboard: No address found in wallet data');
          }
        } catch (error) {
          console.error('Dashboard: Error parsing MasChain wallet data:', error);
        }
      } else {
        console.log('Dashboard: No wallet data found in localStorage');
      }
    };

    checkMasChainConnection();

    // Demo: Set a demo authentication token for KYC functionality
    if (!localStorage.getItem('fairlance_token')) {
      const demoToken = 'demo_token_' + Date.now();
      localStorage.setItem('fairlance_token', demoToken);
      console.log('Demo: Set authentication token for KYC functionality');
    }

    // Listen for storage changes (when wallet is created in another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'maschain_wallet') {
        checkMasChainConnection();
      }
    };

    // Listen for custom wallet connection events
    const handleWalletConnection = () => {
      checkMasChainConnection();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('maschain-wallet-connected', handleWalletConnection);

    // Also check periodically in case localStorage was updated in the same tab
    const interval = setInterval(checkMasChainConnection, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('maschain-wallet-connected', handleWalletConnection);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg hexagon-bg flex items-center justify-center">
        <Card className="web3-card max-w-md w-full mx-4">
          <div className="p-8 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to access your FairLance dashboard
            </p>
            <MasChainConnectButton className="web3-button w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your FairLance overview.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
              {userStats.kycStatus === 'verified' && (
                <Badge className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  KYC Verified
                </Badge>
              )}
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-400">MasChain</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="web3-card">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                  <p className="text-2xl font-bold">{userStats.projectsCompleted}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="web3-card">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${userStats.totalEarnings}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="web3-card">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{Number(userStats.averageRating).toFixed(1)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="web3-card">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trust Score</p>
                  <p className="text-2xl font-bold">{userStats.trustScore}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="kyc">KYC</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="proof-work">Proof of Work</TabsTrigger>
              <TabsTrigger value="nfts">Trust NFTs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="web3-card">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium">Project Completed</p>
                          <p className="text-sm text-muted-foreground">DeFi Dashboard - $500 USDC</p>
                        </div>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Award className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">Skill Token Earned</p>
                          <p className="text-sm text-muted-foreground">+25 React tokens</p>
                        </div>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <div className="flex-1">
                          <p className="font-medium">Trust NFT Issued</p>
                          <p className="text-sm text-muted-foreground">Project completion certificate</p>
                        </div>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="web3-card">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full web3-button justify-start" asChild>
                        <Link href="/projects">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Browse New Projects
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/profile">
                          <User className="w-4 h-4 mr-2" />
                          Update Profile
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/analytics">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Analytics
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/leaderboards">
                          <Award className="w-4 h-4 mr-2" />
                          Skill Leaderboards
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="kyc">
              <KYCVerification />
            </TabsContent>

            <TabsContent value="skills">
              <SkillTokenDashboard />
            </TabsContent>

            <TabsContent value="proof-work">
              <div className="space-y-6">
                <Card className="web3-card">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Submit Proof of Work</h3>
                    <p className="text-muted-foreground mb-6">
                      Demonstrate your work completion with verifiable deliverables using GitHub commits, IPFS hashes, or file URLs.
                    </p>
                    <ProofOfWorkSubmission 
                      projectId="demo-project-1" 
                      milestoneId={0}
                      onSubmissionComplete={() => toast.success('Proof of work submitted!')}
                    />
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nfts">
              <Card className="web3-card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Trust NFTs</h3>
                  <p className="text-muted-foreground mb-6">
                    Your on-chain reputation certificates that prove your work quality and trustworthiness.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((nft) => (
                      <div key={nft} className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-3 flex items-center justify-center">
                          <Award className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-medium mb-1">Trust Certificate #{nft}</h4>
                        <p className="text-sm text-muted-foreground mb-2">Project Completion</p>
                        <Badge variant="outline" className="text-xs">
                          +{10 + nft * 2} Trust Points
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
