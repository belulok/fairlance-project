'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Clock, DollarSign, User, CheckCircle, XCircle, MessageSquare, Eye, Calendar, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  projectId: number;
  freelancer: {
    id: string;
    name: string;
    avatar: string;
    trustScore: number;
    skills: string[];
    stats: {
      projectsCompleted: number;
      averageRating: number;
      responseTime: number;
    };
  };
  project: {
    id: number;
    title: string;
    budget: {
      min: number;
      max: number;
      currency: string;
    };
  };
  status: 'pending' | 'accepted' | 'rejected';
  proposedBudget: number;
  proposedTimeline: string;
  coverLetter: string;
  submittedAt: string;
  views: number;
  messages: number;
}

export default function ManageProposals() {
  const { isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (isConnected) {
      loadProposals();
    }
  }, [isConnected]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/proposals');
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      const response = await fetch(`http://localhost:5001/api/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Proposal accepted!', {
          description: `Smart contract deployed at ${result.contract.address.substring(0, 10)}...`
        });
        
        // Update local state
        setProposals(prev => prev.map(p => 
          p.id === proposalId 
            ? { ...p, status: 'accepted' as const }
            : p
        ));
      } else {
        throw new Error('Failed to accept proposal');
      }
    } catch (error) {
      toast.error('Failed to accept proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(proposalId);
    try {
      const response = await fetch(`http://localhost:5001/api/proposals/${proposalId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (response.ok) {
        toast.success('Proposal rejected');
        
        // Update local state
        setProposals(prev => prev.map(p => 
          p.id === proposalId 
            ? { ...p, status: 'rejected' as const }
            : p
        ));
        
        setSelectedProposal(null);
        setRejectionReason('');
      } else {
        throw new Error('Failed to reject proposal');
      }
    } catch (error) {
      toast.error('Failed to reject proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    if (activeTab === 'all') return true;
    return proposal.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
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
            Please connect your wallet to manage proposals.
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
          <h1 className="text-3xl font-bold mb-2">Manage Proposals</h1>
          <p className="text-muted-foreground">Review and manage proposals for your projects</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({proposals.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({proposals.filter(p => p.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({proposals.filter(p => p.status === 'accepted').length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({proposals.filter(p => p.status === 'rejected').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="web3-card animate-pulse">
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredProposals.length === 0 ? (
              <Card className="web3-card p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No proposals found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' 
                    ? "No pending proposals to review."
                    : `No ${activeTab} proposals found.`
                  }
                </p>
              </Card>
            ) : (
              filteredProposals.map((proposal) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="web3-card hover:scale-[1.01] transition-all duration-300">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Freelancer Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={proposal.freelancer.avatar} />
                              <AvatarFallback>{proposal.freelancer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{proposal.freelancer.name}</h3>
                                <Badge className={getStatusColor(proposal.status)}>
                                  {getStatusIcon(proposal.status)}
                                  <span className="ml-1 capitalize">{proposal.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Applied for: <strong>{proposal.project.title}</strong>
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  {proposal.freelancer.stats.averageRating.toFixed(1)}
                                </span>
                                <span>{proposal.freelancer.stats.projectsCompleted} projects</span>
                                <span>Trust Score: {proposal.freelancer.trustScore}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Cover Letter:</h4>
                            <p className="text-muted-foreground text-sm line-clamp-3">
                              {proposal.coverLetter}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {proposal.freelancer.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {proposal.freelancer.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{proposal.freelancer.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Proposal Details */}
                        <div className="lg:w-80 space-y-4">
                          <div className="text-center lg:text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${proposal.proposedBudget.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Proposed Budget</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Timeline: {proposal.proposedTimeline}
                            </div>
                          </div>

                          <div className="flex justify-center lg:justify-end gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {proposal.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {proposal.messages}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(proposal.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          {proposal.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAcceptProposal(proposal.id)}
                                disabled={actionLoading === proposal.id}
                                className="web3-button flex-1"
                              >
                                {actionLoading === proposal.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Accept
                                  </>
                                )}
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedProposal(proposal)}
                                    className="flex-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Proposal</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                      Please provide a reason for rejecting this proposal. This will help the freelancer improve future applications.
                                    </p>
                                    <div>
                                      <Label htmlFor="reason">Rejection Reason</Label>
                                      <Textarea
                                        id="reason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Please explain why this proposal doesn't meet your requirements..."
                                        rows={4}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleRejectProposal(proposal.id)}
                                        disabled={actionLoading === proposal.id || !rejectionReason.trim()}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        {actionLoading === proposal.id ? (
                                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : null}
                                        Confirm Rejection
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}

                          {proposal.status === 'accepted' && (
                            <Button className="web3-button w-full" asChild>
                              <a href={`/project/${proposal.projectId}/workspace`}>
                                Go to Workspace
                              </a>
                            </Button>
                          )}
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
