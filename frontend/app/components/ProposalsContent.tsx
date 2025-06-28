'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, ChevronRight, User, History, Info, Settings, Sparkles, DollarSign, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ClientOnlyConnectButton } from '@/app/components/ClientOnlyConnectButton';
import { CountdownTimer } from '@/app/components/CountdownTimer';

// Mock data - Replace with actual data from smart contract
const mockProposals = [
  {
    id: 1,
    title: "Community Treasury Allocation",
    description: "Proposal to allocate 1000 tokens for community development initiatives and reward active contributors in the ecosystem.",
    yesVotes: 156,
    noVotes: 23,
    deadline: new Date(Date.now() + 172800000), // 2 days from now
    status: 'active' as const,
    creator: '0x1234...5678',
    category: 'Treasury'
  },
  {
    id: 2,
    title: "Protocol Upgrade v2.0",
    description: "Major protocol upgrade to improve scalability and reduce gas costs for all users.",
    yesVotes: 89,
    noVotes: 45,
    deadline: new Date(Date.now() + 259200000), // 3 days from now
    status: 'active' as const,
    creator: '0x8765...4321',
    category: 'Technical'
  },
  {
    id: 3,
    title: "Marketing Campaign Fund",
    description: "Allocate budget for Q4 marketing initiatives to increase platform adoption.",
    yesVotes: 234,
    noVotes: 67,
    deadline: new Date(Date.now() + 86400000), // 1 day from now
    status: 'active' as const,
    creator: '0x9876...1234',
    category: 'Marketing'
  }
];

function ProposalCard({ proposal }: { proposal: typeof mockProposals[0] }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { isConnected } = useAccount();

  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0;

  const handleVote = async (vote: 'yes' | 'no') => {
    if (!isConnected || hasVoted) return;
    
    setIsVoting(true);
    // Simulate voting transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setHasVoted(true);
    setIsVoting(false);
    toast.success(`Vote cast successfully! You voted ${vote.toUpperCase()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="web3-card hover:scale-[1.01] transition-all duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {proposal.category}
                </Badge>
                <Badge 
                  variant={proposal.status === 'active' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {proposal.status}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                <Link href={`/proposal/${proposal.id}`}>
                  {proposal.title}
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {proposal.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{proposal.creator}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <CountdownTimer deadline={proposal.deadline} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Yes: {proposal.yesVotes}</span>
              <span className="text-red-600 font-medium">No: {proposal.noVotes}</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-green-500 transition-all duration-500"
                  style={{ width: `${yesPercentage}%` }}
                />
                <div 
                  className="bg-red-500 transition-all duration-500"
                  style={{ width: `${noPercentage}%` }}
                />
              </div>
            </div>

            {isConnected && !hasVoted && proposal.status === 'active' && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleVote('yes')}
                  disabled={isVoting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {isVoting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Vote Yes
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleVote('no')}
                  disabled={isVoting}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  {isVoting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Vote No
                    </>
                  )}
                </Button>
              </div>
            )}

            {hasVoted && (
              <div className="text-center text-sm text-muted-foreground pt-2">
                ✓ You have already voted on this proposal
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ProposalsContent() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-2"
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Community Governance</span>
            </motion.div>

            <h1 className="text-4xl font-bold mb-4">Make Your Voice Heard</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Participate in active proposals and help guide the future of our community through democratic decision-making.
            </p>
            {!isConnected ? (
              <ClientOnlyConnectButton />
            ) : (
              <Link href="/create">
                <Button className="web3-button group">
                  Create New Proposal
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Active Proposals</h2>
            {isConnected && (
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="outline" className="web3-button">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="web3-button">
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </Button>
                </Link>
                <Link href="/results">
                  <Button variant="outline" className="web3-button">
                    <History className="w-4 h-4 mr-2" />
                    Results
                  </Button>
                </Link>
                <Link href="/my-proposals">
                  <Button variant="outline" className="web3-button">
                    <User className="w-4 h-4 mr-2" />
                    My Proposals
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {mockProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>

          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mt-8"
            >
              <p className="text-muted-foreground mb-4">
                Connect your wallet to vote on proposals
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
