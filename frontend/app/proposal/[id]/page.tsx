'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Timer, Check, X, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data - Replace with actual data from smart contract
const mockProposal = {
  id: 1,
  title: "Community Treasury Allocation",
  description: "Proposal to allocate 1000 tokens for community development initiatives and reward active contributors in the ecosystem. This funding will be used to support various community-driven projects, hackathons, and educational content creation.",
  yesVotes: 156,
  noVotes: 23,
  deadline: new Date(Date.now() + 172800000), // 2 days from now
  createdAt: new Date(Date.now() - 604800000), // 7 days ago
  creator: "0x1234...5678",
  hasVoted: false,
  voters: [
    { address: "0xabcd...ef12", vote: "yes", timestamp: new Date(Date.now() - 345600000) },
    { address: "0x7890...1234", vote: "no", timestamp: new Date(Date.now() - 259200000) },
    { address: "0xfedc...ba98", vote: "yes", timestamp: new Date(Date.now() - 172800000) },
  ]
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

export default function ProposalDetail() {
  const { id } = useParams();
  const { isConnected } = useAccount();
  const [isVoting, setIsVoting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen gradient-bg hexagon-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const isExpired = mockProposal.deadline.getTime() < Date.now();
  const totalVotes = mockProposal.yesVotes + mockProposal.noVotes;
  
  const chartData = [
    { name: 'Yes', value: mockProposal.yesVotes },
    { name: 'No', value: mockProposal.noVotes }
  ];

  const handleVote = async (vote: 'yes' | 'no') => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsVoting(true);
    try {
      // TODO: Implement actual voting logic with smart contract
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate transaction
      toast.success('Vote submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Link href="/proposals" className="mb-8 inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Proposals
            </Link>

            <Card className="web3-card overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{mockProposal.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {mockProposal.creator}
                      </div>
                      <div>
                        Created {new Date(mockProposal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{mockProposal.description}</p>
                  </div>
                  {isExpired ? (
                    <Badge variant="secondary">Expired</Badge>
                  ) : (
                    <div className="flex items-center text-sm">
                      <Timer className="w-4 h-4 mr-1" />
                      <span>
                        {Math.ceil((mockProposal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vote Chart */}
                  <div className="bg-card/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Vote Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {isConnected && !isExpired && !mockProposal.hasVoted && (
                      <div className="flex gap-4 mt-6">
                        <Button
                          onClick={() => handleVote('yes')}
                          disabled={isVoting}
                          className="flex-1 web3-button"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Vote Yes
                        </Button>
                        <Button
                          onClick={() => handleVote('no')}
                          disabled={isVoting}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Vote No
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Recent Votes */}
                  <div className="bg-card/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Votes</h3>
                    <div className="space-y-4">
                      {mockProposal.voters.map((voter, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span className="text-sm">{voter.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={voter.vote === 'yes' ? 'default' : 'destructive'}>
                              {voter.vote.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(voter.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}