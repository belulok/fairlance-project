'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  User, 
  Wallet, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Github,
  FileText,
  TrendingUp,
  Shield,
  Coins
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    wallet: string;
    rating: number;
    projectsCompleted: number;
  };
  freelancer: {
    name: string;
    wallet: string;
    rating: number;
    skills: string[];
    kycVerified: boolean;
  };
  budget: {
    amount: number;
    currency: string;
    escrowContract: string;
  };
  milestones: any[];
  skills: string[];
  category: string;
  duration: string;
  status: string;
  createdAt: string;
  blockchain: {
    contractAddress: string;
    totalLocked: number;
    released: number;
    pending: number;
    transactions: any[];
  };
}

export default function DemoProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDemoProjects();
    loadBlockchainStats();
  }, []);

  const loadDemoProjects = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/demo/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load demo projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockchainStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/demo/projects/stats/blockchain');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load blockchain stats:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMilestoneProgress = (milestones: any[]) => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    return (completed / milestones.length) * 100;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading demo projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Demo Projects</h1>
        <p className="text-muted-foreground mt-2">
          Explore blockchain-powered freelance projects with proof-of-work verification
        </p>
      </div>

      {/* Blockchain Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalValueLocked.toFixed(2)} MAS</div>
                  <div className="text-sm text-muted-foreground">Total Value Locked</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.completedMilestones}</div>
                  <div className="text-sm text-muted-foreground">Completed Milestones</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.kycVerifiedFreelancers}</div>
                  <div className="text-sm text-muted-foreground">KYC Verified</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {project.description.substring(0, 120)}...
                  </CardDescription>
                </div>
                {getStatusBadge(project.status)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {project.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {project.duration}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Budget & Blockchain Info */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Budget</span>
                  <span className="font-bold">{project.budget.amount} {project.budget.currency}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Released:</span>
                    <span className="ml-1 text-green-600 font-medium">
                      {project.blockchain.released} MAS
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="ml-1 text-orange-600 font-medium">
                      {project.blockchain.pending} MAS
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {project.milestones.filter(m => m.status === 'completed').length} / {project.milestones.length} milestones
                  </span>
                </div>
                <Progress value={getMilestoneProgress(project.milestones)} className="h-2" />
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Client</div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm">{project.client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ⭐ {project.client.rating} • {project.client.projectsCompleted} projects
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1 flex items-center gap-1">
                    Freelancer
                    {project.freelancer.kycVerified && (
                      <Shield className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm">{project.freelancer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ⭐ {project.freelancer.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-sm font-medium mb-2">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {project.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {project.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wallet className="w-3 h-3" />
                  <span>Smart Contract</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Contract
                  </Button>
                  <Button size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
