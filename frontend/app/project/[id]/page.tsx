'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, DollarSign, MapPin, Star, Users, Clock, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

// Mock project data - in real app, this would come from API
const mockProject = {
  id: 1,
  title: "Build DeFi Dashboard with Advanced Analytics",
  description: "Create a comprehensive DeFi dashboard featuring real-time analytics, portfolio tracking, yield farming opportunities, and cross-chain asset management. The platform should support 10+ blockchains and integrate with major DeFi protocols like Uniswap, Aave, and Compound. Must include advanced charting, risk assessment tools, and automated rebalancing features.",
  budget: { min: 2500, max: 4000, currency: "USDC" },
  deadline: new Date(Date.now() + 1209600000),
  category: "Development",
  skills: ["React", "Web3.js", "DeFi", "TypeScript", "Node.js", "GraphQL", "TradingView Charts"],
  client: {
    name: "DeFi Capital Partners",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 4.9,
    reviews: 127,
    verified: true,
    memberSince: "2022-03-15",
    totalSpent: 45000,
    location: "Singapore",
    timezone: "GMT+8"
  },
  proposals: 34,
  featured: true,
  status: "open",
  urgency: "high",
  projectType: "fixed",
  estimatedHours: 120,
  tags: ["DeFi", "Analytics", "Multi-chain", "Enterprise"],
  attachments: ["requirements.pdf", "wireframes.figma"],
  postedDate: new Date(Date.now() - 172800000),
  viewCount: 156,
  requirements: [
    "5+ years experience with React and TypeScript",
    "Deep understanding of DeFi protocols and Web3 integration",
    "Experience with real-time data visualization",
    "Knowledge of cross-chain technologies",
    "Portfolio demonstrating similar projects"
  ],
  deliverables: [
    "Responsive React dashboard application",
    "Real-time price and analytics integration",
    "Multi-chain wallet connection",
    "Comprehensive documentation",
    "Deployment and testing"
  ]
};

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState(mockProject);
  const [isApplying, setIsApplying] = useState(false);

  const { isConnected, address } = useAccount();

  const handleApply = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first to apply for this project.');
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch('http://localhost:5001/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || '',
        },
        body: JSON.stringify({
          projectId: parseInt(params.id as string),
          proposedBudget: 1000, // Default budget - should be from form
          proposedTimeline: '2 weeks', // Default timeline - should be from form
          coverLetter: 'I am interested in this project and have the required skills.', // Default cover letter
        }),
      });

      if (response.ok) {
        alert('Application submitted successfully! The client will review your proposal.');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit application. Please check your connection and try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button variant="ghost" className="web3-button" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="web3-card p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{project.category}</Badge>
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        {project.urgency}
                      </Badge>
                      {project.featured && (
                        <Badge className="bg-gradient-to-r from-primary to-purple-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Posted {Math.floor((Date.now() - project.postedDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.proposals} proposals
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {project.estimatedHours} hours
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">{project.budget.currency}</div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-lg">{project.description}</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="web3-card p-6">
                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Deliverables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="web3-card p-6">
                <h2 className="text-xl font-bold mb-4">Deliverables</h2>
                <ul className="space-y-2">
                  {project.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="web3-card p-6">
                <Button
                  className="web3-button w-full mb-4"
                  onClick={handleApply}
                  disabled={isApplying || !isConnected}
                >
                  {isApplying ? 'Submitting...' :
                   !isConnected ? 'Connect Wallet to Apply' :
                   'Apply for this Project'}
                </Button>
                {!isConnected && (
                  <p className="text-sm text-yellow-400 text-center mb-4">
                    ⚠️ Wallet connection required to submit proposals
                  </p>
                )}
                <div className="text-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Protected by smart contract escrow
                </div>
              </Card>
            </motion.div>

            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="web3-card p-6">
                <h3 className="font-bold mb-4">About the Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={project.client.avatar} />
                    <AvatarFallback>{project.client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {project.client.name}
                      {project.client.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Member since {new Date(project.client.memberSince).getFullYear()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{Number(project.client.rating).toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({project.client.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Spent</span>
                    <span className="font-semibold">${project.client.totalSpent.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location</span>
                    <span className="font-semibold">{project.client.location}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="web3-card p-6">
                <h3 className="font-bold mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Project Type</span>
                    <Badge variant="outline">{project.projectType}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deadline</span>
                    <span className="font-semibold">
                      {Math.ceil((project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Views</span>
                    <span className="font-semibold">{project.viewCount}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
