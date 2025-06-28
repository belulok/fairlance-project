'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, TrendingUp, History, Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - Replace with actual data from smart contract
const mockTopProposals = [
  {
    id: 1,
    title: "Community Treasury Allocation",
    description: "Proposal to allocate 1000 tokens for community development initiatives.",
    yesVotes: 856,
    noVotes: 123,
    ended: new Date(Date.now() - 86400000), // 1 day ago
    passed: true,
  },
  {
    id: 2,
    title: "Protocol Upgrade Implementation",
    description: "Implement the latest protocol upgrade to enhance security features.",
    yesVotes: 789,
    noVotes: 234,
    ended: new Date(Date.now() - 172800000), // 2 days ago
    passed: true,
  },
  {
    id: 3,
    title: "Governance Parameter Update",
    description: "Update voting period duration and quorum requirements.",
    yesVotes: 345,
    noVotes: 567,
    ended: new Date(Date.now() - 259200000), // 3 days ago
    passed: false,
  }
];

const chartData = mockTopProposals.map(proposal => ({
  name: proposal.title.slice(0, 20) + '...',
  Yes: proposal.yesVotes,
  No: proposal.noVotes,
}));

function ProposalCard({ proposal, rank }: { proposal: typeof mockTopProposals[0], rank: number }) {
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = (proposal.yesVotes / totalVotes) * 100;
  const noPercentage = (proposal.noVotes / totalVotes) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
    >
      <Card className="web3-card overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              rank === 0 ? 'bg-yellow-500/20' :
              rank === 1 ? 'bg-gray-300/20' :
              'bg-amber-600/20'
            }`}>
              <Trophy className={`h-6 w-6 ${
                rank === 0 ? 'text-yellow-500' :
                rank === 1 ? 'text-gray-300' :
                'text-amber-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{proposal.title}</h3>
                <Badge variant={proposal.passed ? "default" : "destructive"}>
                  {proposal.passed ? "Passed ✨" : "Failed"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{proposal.description}</p>
              <div className="text-sm text-muted-foreground mb-4">
                Ended {new Date(proposal.ended).toLocaleDateString()}
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

                <Link href={`/proposal/${proposal.id}`}>
                  <Button variant="outline" className="w-full group">
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Results() {
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

            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Vote Distribution Overview</h2>
              </div>
              <Card className="web3-card p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Yes" fill="hsl(var(--primary))" />
                      <Bar dataKey="No" fill="hsl(var(--destructive))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Top Voted Proposals</h2>
              </div>
              <div className="space-y-6">
                {mockTopProposals
                  .sort((a, b) => (b.yesVotes + b.noVotes) - (a.yesVotes + a.noVotes))
                  .map((proposal, index) => (
                    <ProposalCard key={proposal.id} proposal={proposal} rank={index} />
                  ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Recent Activity</h2>
              </div>
              <Card className="web3-card p-6">
                <div className="space-y-4">
                  {mockTopProposals.map((proposal) => (
                    <div key={proposal.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div>
                        <h4 className="font-medium">{proposal.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Ended {new Date(proposal.ended).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={proposal.passed ? "default" : "destructive"}>
                        {proposal.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}