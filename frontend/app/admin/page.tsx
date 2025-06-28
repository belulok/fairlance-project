'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Users, CheckCircle, XCircle, AlertCircle, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

// Mock data - Replace with actual data from smart contract
const mockProposals = [
  {
    id: 1,
    title: "Community Treasury Allocation",
    description: "Proposal to allocate 1000 tokens for community development initiatives.",
    yesVotes: 156,
    noVotes: 23,
    totalVoters: 179,
    executed: true,
    passed: true,
    deadline: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 2,
    title: "Protocol Upgrade Implementation",
    description: "Implement the latest protocol upgrade to enhance security features.",
    yesVotes: 89,
    noVotes: 45,
    totalVoters: 134,
    executed: false,
    passed: true,
    deadline: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: 3,
    title: "Governance Parameter Update",
    description: "Update voting period duration and quorum requirements.",
    yesVotes: 67,
    noVotes: 89,
    totalVoters: 156,
    executed: false,
    passed: false,
    deadline: new Date(Date.now() - 259200000), // 3 days ago
  },
];

const totalStats = {
  totalProposals: mockProposals.length,
  totalVoters: mockProposals.reduce((acc, curr) => acc + curr.totalVoters, 0),
  executedProposals: mockProposals.filter(p => p.executed).length,
  pendingExecution: mockProposals.filter(p => p.passed && !p.executed).length,
};

const votingDistribution = [
  { name: 'Yes Votes', value: mockProposals.reduce((acc, curr) => acc + curr.yesVotes, 0) },
  { name: 'No Votes', value: mockProposals.reduce((acc, curr) => acc + curr.noVotes, 0) },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

function StatCard({ title, value, icon: Icon, className = "" }: { 
  title: string;
  value: number;
  icon: any;
  className?: string;
}) {
  return (
    <Card className={`web3-card p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
}

function ProposalRow({ proposal }: { proposal: typeof mockProposals[0] }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(proposal.executed);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      // TODO: Implement actual execution logic with smart contract
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate transaction
      setExecuted(true);
      toast.success('Proposal executed successfully!');
    } catch (error) {
      toast.error('Failed to execute proposal');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="web3-card p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{proposal.title}</h3>
          <p className="text-sm text-muted-foreground">{proposal.description}</p>
        </div>
        <Badge variant={proposal.passed ? "default" : "destructive"}>
          {proposal.passed ? "Passed" : "Failed"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Yes Votes</p>
          <p className="font-semibold">{proposal.yesVotes}</p>
        </div>
        <div>
          <p className="text-muted-foreground">No Votes</p>
          <p className="font-semibold">{proposal.noVotes}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Voters</p>
          <p className="font-semibold">{proposal.totalVoters}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Ended</p>
          <p className="font-semibold">{new Date(proposal.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Executed</span>
          <Switch
            checked={executed}
            disabled={!proposal.passed || executed || isExecuting}
          />
        </div>
        <div className="flex gap-2">
          <Link href={`/proposal/${proposal.id}`}>
            <Button variant="outline" className="group">
              View Details
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          {proposal.passed && !executed && (
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              className="web3-button"
            >
              Execute Proposal
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const { isConnected } = useAccount();
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
            <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-8">
              Please connect your wallet to access the admin dashboard
            </p>
            <Link href="/proposals">
              <Button variant="outline" className="web3-button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Proposals
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage proposals and monitor governance activity
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Total Proposals"
                value={totalStats.totalProposals}
                icon={AlertCircle}
              />
              <StatCard
                title="Total Voters"
                value={totalStats.totalVoters}
                icon={Users}
              />
              <StatCard
                title="Executed Proposals"
                value={totalStats.executedProposals}
                icon={CheckCircle}
              />
              <StatCard
                title="Pending Execution"
                value={totalStats.pendingExecution}
                icon={XCircle}
              />
            </div>

            {/* Voting Distribution Chart */}
            <Card className="web3-card p-6 mb-12">
              <h2 className="text-xl font-bold mb-6">Overall Voting Distribution</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={votingDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {votingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Proposals List */}
            <div>
              <h2 className="text-xl font-bold mb-6">All Proposals</h2>
              <div className="space-y-6">
                {mockProposals.map((proposal) => (
                  <ProposalRow key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}