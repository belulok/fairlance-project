'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, DollarSign, Clock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownLeft, Loader2, Copy } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'deposit' | 'release' | 'refund' | 'fee';
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  gasPrice: string;
  timestamp: string;
  confirmations: number;
  project: {
    id: number;
    title: string;
  };
  milestone?: {
    id: number;
    description: string;
  };
  contractAddress: string;
}

interface EscrowContract {
  address: string;
  projectId: number;
  projectTitle: string;
  totalAmount: number;
  releasedAmount: number;
  remainingAmount: number;
  status: 'active' | 'completed' | 'disputed';
  milestones: Array<{
    id: number;
    amount: number;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
    releasedAt?: string;
  }>;
  createdAt: string;
  lastActivity: string;
}

export default function Transactions() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contracts, setContracts] = useState<EscrowContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    if (isConnected) {
      loadData();
    }
  }, [isConnected]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load transactions (mock data for demo)
      const mockTransactions: Transaction[] = [
        {
          id: 'tx_1',
          type: 'deposit',
          amount: 4000,
          currency: 'USDC',
          status: 'confirmed',
          transactionHash: '0x8f2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
          blockNumber: 18567890,
          gasUsed: 65000,
          gasPrice: '20000000000',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          confirmations: 24,
          project: {
            id: 1,
            title: 'DeFi Dashboard Development'
          },
          contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
        },
        {
          id: 'tx_2',
          type: 'release',
          amount: 1600,
          currency: 'USDC',
          status: 'confirmed',
          transactionHash: '0x7e1a0b8c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
          blockNumber: 18568120,
          gasUsed: 45000,
          gasPrice: '18000000000',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          confirmations: 18,
          project: {
            id: 1,
            title: 'DeFi Dashboard Development'
          },
          milestone: {
            id: 1,
            description: 'Frontend Development'
          },
          contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
        },
        {
          id: 'tx_3',
          type: 'deposit',
          amount: 6500,
          currency: 'USDC',
          status: 'pending',
          transactionHash: '0x6d0a9b7c1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
          blockNumber: 18568250,
          gasUsed: 68000,
          gasPrice: '22000000000',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          confirmations: 3,
          project: {
            id: 2,
            title: 'Smart Contract Security Audit'
          },
          contractAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
        }
      ];

      // Load escrow contracts (mock data for demo)
      const mockContracts: EscrowContract[] = [
        {
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          projectId: 1,
          projectTitle: 'DeFi Dashboard Development',
          totalAmount: 4000,
          releasedAmount: 1600,
          remainingAmount: 2400,
          status: 'active',
          milestones: [
            {
              id: 1,
              amount: 1600,
              description: 'Frontend Development',
              status: 'completed',
              releasedAt: new Date(Date.now() - 43200000).toISOString()
            },
            {
              id: 2,
              amount: 1600,
              description: 'Backend Integration',
              status: 'in-progress',
              dueDate: new Date(Date.now() + 604800000).toISOString()
            },
            {
              id: 3,
              amount: 800,
              description: 'Testing & Deployment',
              status: 'pending',
              dueDate: new Date(Date.now() + 1209600000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          lastActivity: new Date(Date.now() - 43200000).toISOString()
        },
        {
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          projectId: 2,
          projectTitle: 'Smart Contract Security Audit',
          totalAmount: 6500,
          releasedAmount: 0,
          remainingAmount: 6500,
          status: 'active',
          milestones: [
            {
              id: 1,
              amount: 3000,
              description: 'Initial Assessment',
              status: 'pending',
              dueDate: new Date(Date.now() + 604800000).toISOString()
            },
            {
              id: 2,
              amount: 2500,
              description: 'Detailed Audit',
              status: 'pending',
              dueDate: new Date(Date.now() + 1209600000).toISOString()
            },
            {
              id: 3,
              amount: 1000,
              description: 'Final Report',
              status: 'pending',
              dueDate: new Date(Date.now() + 1814400000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastActivity: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setTransactions(mockTransactions);
      setContracts(mockContracts);
    } catch (error) {
      console.error('Failed to load transaction data:', error);
      toast.error('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'release':
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
      case 'refund':
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
      case 'in-progress':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'failed':
      case 'disputed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'disputed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg hexagon-bg flex items-center justify-center">
        <Card className="web3-card p-8 max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to view transactions.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">Monitor your payments and escrow contracts</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="contracts">Escrow Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="web3-card animate-pulse">
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="web3-card hover:scale-[1.01] transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(tx.type)}
                          <div>
                            <h3 className="font-semibold capitalize">{tx.type}</h3>
                            <p className="text-sm text-muted-foreground">{tx.project.title}</p>
                            {tx.milestone && (
                              <p className="text-xs text-muted-foreground">
                                Milestone: {tx.milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            ${tx.amount.toLocaleString()} {tx.currency}
                          </div>
                          <Badge className={getStatusColor(tx.status)}>
                            {getStatusIcon(tx.status)}
                            <span className="ml-1 capitalize">{tx.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Block:</span>
                          <div className="font-mono">{tx.blockNumber.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gas Used:</span>
                          <div className="font-mono">{tx.gasUsed.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confirmations:</span>
                          <div className="font-mono">{tx.confirmations}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <div>{new Date(tx.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Hash:</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {tx.transactionHash.substring(0, 10)}...{tx.transactionHash.substring(-8)}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(tx.transactionHash)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on Etherscan
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="web3-card animate-pulse">
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              contracts.map((contract) => (
                <motion.div
                  key={contract.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="web3-card">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{contract.projectTitle}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Contract:</span>
                            <code className="bg-muted px-2 py-1 rounded">
                              {contract.address.substring(0, 10)}...{contract.address.substring(-8)}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(contract.address)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusIcon(contract.status)}
                          <span className="ml-1 capitalize">{contract.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            ${contract.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Amount</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            ${contract.releasedAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Released</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            ${contract.remainingAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Milestones:</h4>
                        {contract.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{milestone.description}</div>
                              <div className="text-sm text-muted-foreground">
                                ${milestone.amount.toLocaleString()} USDC
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(milestone.status)}>
                                {getStatusIcon(milestone.status)}
                                <span className="ml-1 capitalize">{milestone.status}</span>
                              </Badge>
                              {milestone.status === 'completed' && milestone.releasedAt && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Released {new Date(milestone.releasedAt).toLocaleDateString()}
                                </div>
                              )}
                              {milestone.status !== 'completed' && milestone.dueDate && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Due {new Date(milestone.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Created: {new Date(contract.createdAt).toLocaleDateString()}</span>
                          <span>Last Activity: {new Date(contract.lastActivity).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
