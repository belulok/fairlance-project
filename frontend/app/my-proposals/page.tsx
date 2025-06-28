'use client';

import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Timer, Copy, ExternalLink, User, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

// Mock data - Replace with actual data from smart contract
const mockMyProposals = [
  {
    id: 1,
    title: "Community Treasury Allocation",
    description: "Proposal to allocate 1000 tokens for community development initiatives.",
    yesVotes: 156,
    noVotes: 23,
    deadline: new Date(Date.now() + 172800000), // 2 days from now
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
  },
  {
    id: 2,
    title: "Protocol Upgrade Implementation",
    description: "Implement the latest protocol upgrade to enhance security features.",
    yesVotes: 89,
    noVotes: 45,
    deadline: new Date(Date.now() - 86400000), // 1 day ago (expired)
    createdAt: new Date(Date.now() - 1209600000), // 14 days ago
  }
];

function ProposalCard({ proposal }: { proposal: typeof mockMyProposals[0] }) {
  const isExpired = proposal.deadline.getTime() < Date.now();
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  
  const copyProposalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = `${window.location.origin}/proposal/${proposal.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Proposal link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="web3-card overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{proposal.title}</h3>
                <Badge variant={isExpired ? "secondary" : "default"}>
                  {isExpired ? "Expired" : "Active"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{proposal.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Created {new Date(proposal.createdAt).toLocaleDateString()}
                </div>
                {!isExpired && (
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    {Math.ceil((proposal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">Yes ({proposal.yesVotes})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">({proposal.noVotes}) No</span>
                <X className="w-4 h-4 text-red-500" />
              </div>
            </div>

            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Link href={`/proposal/${proposal.id}`} className="flex-1">
                <Button variant="outline" className="w-full group">
                  View Details
                  <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                onClick={copyProposalLink}
                variant="outline"
                className="web3-button"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function MyProposals() {
  const { isConnected, address } = useAccount();
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

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg hexagon-bg py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">Connect Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Please connect your wallet to view your proposals
            </p>
            <div className="flex justify-center gap-4">
              <ConnectButton />
              <Link href="/proposals">
                <Button variant="outline" className="web3-button">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Proposals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link href="/proposals" className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Proposals
                </Link>
                <h1 className="text-3xl font-bold">My Proposals</h1>
              </div>
              <div className="flex items-center gap-4">
                <ConnectButton />
                <Link href="/create">
                  <Button className="web3-button">
                    Create New Proposal
                  </Button>
                </Link>
              </div>
            </div>

            {mockMyProposals.length > 0 ? (
              <div className="space-y-6">
                {mockMyProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            ) : (
              <Card className="web3-card p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No Proposals Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any proposals yet. Start participating in the community by creating your first proposal.
                </p>
                <Link href="/create">
                  <Button className="web3-button">
                    Create Your First Proposal
                  </Button>
                </Link>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}