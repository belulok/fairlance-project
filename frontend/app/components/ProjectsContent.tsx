'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, DollarSign, Clock, MapPin, User, Star, ChevronRight, Briefcase, Code, Palette, Megaphone, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MasChainConnectButton } from '@/app/components/MasChainConnectButton';
import { api, type Project } from '@/lib/api';
import SimplePagination from './SimplePagination';

// Mock freelance projects data
const mockProjects = [
  {
    id: 1,
    title: "Build DeFi Dashboard",
    description: "Create a modern DeFi dashboard with real-time analytics, portfolio tracking, and yield farming opportunities. Must have experience with React, Web3.js, and DeFi protocols.",
    budget: "500 USDC",
    budgetMin: 400,
    budgetMax: 600,
    deadline: new Date(Date.now() + 172800000), // 2 days from now
    category: "Development",
    skills: ["React", "Web3.js", "DeFi", "TypeScript"],
    client: {
      name: "CryptoVentures",
      rating: 4.8,
      reviews: 23,
      verified: true
    },
    proposals: 12,
    featured: true
  },
  {
    id: 2,
    title: "Smart Contract Audit",
    description: "Security audit for NFT marketplace smart contracts. Need comprehensive testing, vulnerability assessment, and detailed report with recommendations.",
    budget: "1200 USDC",
    budgetMin: 1000,
    budgetMax: 1500,
    deadline: new Date(Date.now() + 259200000), // 3 days from now
    category: "Security",
    skills: ["Solidity", "Security", "Smart Contracts", "Auditing"],
    client: {
      name: "NFTMarket",
      rating: 4.9,
      reviews: 45,
      verified: true
    },
    proposals: 8,
    featured: false
  },
  {
    id: 3,
    title: "Web3 Mobile App Design",
    description: "Design a modern mobile app for decentralized social media platform. Need UI/UX design, prototyping, and design system creation.",
    budget: "800 USDC",
    budgetMin: 700,
    budgetMax: 900,
    deadline: new Date(Date.now() + 345600000), // 4 days from now
    category: "Design",
    skills: ["UI/UX", "Mobile Design", "Figma", "Prototyping"],
    client: {
      name: "SocialDAO",
      rating: 4.7,
      reviews: 18,
      verified: false
    },
    proposals: 15,
    featured: true
  },
  {
    id: 4,
    title: "DeFi Protocol Marketing",
    description: "Create comprehensive marketing strategy for new DeFi protocol launch. Include social media, content creation, and community building.",
    budget: "600 USDC",
    budgetMin: 500,
    budgetMax: 700,
    deadline: new Date(Date.now() + 432000000), // 5 days from now
    category: "Marketing",
    skills: ["Marketing", "Social Media", "Content Creation", "DeFi"],
    client: {
      name: "DefiLabs",
      rating: 4.6,
      reviews: 31,
      verified: true
    },
    proposals: 22,
    featured: false
  },
  {
    id: 5,
    title: "Blockchain Integration",
    description: "Integrate blockchain functionality into existing e-commerce platform. Need Web3 wallet connection, NFT support, and crypto payments.",
    budget: "1500 USDC",
    budgetMin: 1200,
    budgetMax: 1800,
    deadline: new Date(Date.now() + 518400000), // 6 days from now
    category: "Development",
    skills: ["Blockchain", "Web3", "E-commerce", "Integration"],
    client: {
      name: "TechCommerce",
      rating: 4.5,
      reviews: 12,
      verified: true
    },
    proposals: 6,
    featured: false
  }
];

const categories = [
  { value: "all", label: "All Categories", icon: Briefcase },
  { value: "development", label: "Development", icon: Code },
  { value: "design", label: "Design", icon: Palette },
  { value: "marketing", label: "Marketing", icon: Megaphone },
  { value: "security", label: "Security", icon: Shield }
];

function ProjectCard({ project }: { project: any }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const checkMasChainConnection = () => {
      const masChainWallet = localStorage.getItem('maschain_wallet');
      if (masChainWallet) {
        try {
          const walletData = JSON.parse(masChainWallet);
          setIsConnected(!!walletData.address);
        } catch (error) {
          console.error('Error parsing MasChain wallet data:', error);
        }
      }
    };

    checkMasChainConnection();
  }, []);

  const handleApply = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to apply');
      return;
    }

    setIsApplying(true);
    try {
      // TODO: Implement real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Application submitted successfully!', {
        description: `You've applied for "${project.title}"`
      });
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  // Handle both API format and mock format
  const deadline = project.deadline
    ? (typeof project.deadline === 'string' ? new Date(project.deadline) : project.deadline)
    : (project.timeline?.endDate ? new Date(project.timeline.endDate) : null);

  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const budget = typeof project.budget === 'string' ? project.budget : `$${project.budget.min}-${project.budget.max} ${project.budget.currency}`;
  const proposalCount = Array.isArray(project.proposals) ? project.proposals.length : (project.proposals || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`web3-card hover:scale-[1.01] transition-all duration-300 ${project.featured ? 'ring-2 ring-primary/20' : ''}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge variant="default" className="text-xs bg-primary">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {proposalCount} proposals
                </Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                <Link href={`/project/${project.id}`}>
                  {project.title}
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {project.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.skills.length - 4} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-primary">{budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{daysLeft !== null ? `${daysLeft} days left` : 'No deadline set'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>
                    {project.client?.name ||
                     (project.clientId ? `${project.clientId.firstName} ${project.clientId.lastName}` : 'Unknown Client')}
                  </span>
                  {(project.client?.verified || project.clientId?.isVerified) && (
                    <Badge variant="outline" className="text-xs ml-1">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {project.client?.rating
                      ? Number(project.client.rating).toFixed(1)
                      : (project.clientId?.trustScore ? (project.clientId.trustScore / 20).toFixed(1) : '5.0')}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({project.client?.reviews || 'No reviews yet'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Link href={`/project/${project.id}`}>
              <Button variant="outline" className="web3-button">
                View Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Button 
              onClick={handleApply}
              disabled={isApplying || !isConnected}
              className="web3-button"
            >
              {isApplying ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                'Apply Now'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ProjectsContent() {
  const [isConnected, setIsConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const projectsPerPage = 12;

  useEffect(() => {
    setMounted(true);
    loadProjects();

    const checkMasChainConnection = () => {
      const masChainWallet = localStorage.getItem('maschain_wallet');
      if (masChainWallet) {
        try {
          const walletData = JSON.parse(masChainWallet);
          setIsConnected(!!walletData.address);
        } catch (error) {
          console.error('Error parsing MasChain wallet data:', error);
        }
      }
    };

    checkMasChainConnection();
  }, []);

  useEffect(() => {
    if (mounted) {
      setCurrentPage(1); // Reset to first page when filters change
      loadProjects();
    }
  }, [searchTerm, selectedCategory, sortBy, mounted]);

  useEffect(() => {
    if (mounted) {
      loadProjects();
    }
  }, [currentPage, mounted]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Loading projects for page:', currentPage);

      const response = await api.getProjects({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sort: sortBy,
        status: 'open',
        page: currentPage,
        limit: projectsPerPage
      });

      console.log('🚀 API Response:', response);
      setProjects(response.projects || []);
      setTotalProjects(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / projectsPerPage));
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
      // Fallback to mock data for demo
      setProjects(mockProjects as any);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-4xl font-bold mb-4">Browse Freelance Projects</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover exciting freelance opportunities in the Web3 space. Apply to projects that match your skills and get paid in crypto.
            </p>
            {!isConnected && (
              <div className="mb-8">
                <MasChainConnectButton className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" />
                <p className="text-sm text-muted-foreground mt-2">
                  Connect your MasChain wallet to apply for projects
                </p>
              </div>
            )}
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="budget-high">Highest Budget</SelectItem>
                <SelectItem value="budget-low">Lowest Budget</SelectItem>
                <SelectItem value="deadline">Deadline Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${totalProjects} project${totalProjects !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Pagination - Top */}
          <div style={{ position: 'relative', zIndex: 1000 }}>
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalProjects={totalProjects}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadProjects} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="web3-card animate-pulse">
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Projects List */}
          {!loading && !error && (
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
