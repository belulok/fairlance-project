'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Star, Clock, Users, Award } from 'lucide-react';

const stats = [
  {
    title: 'Total Earnings',
    value: '$125,430',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-500'
  },
  {
    title: 'Active Projects',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: Briefcase,
    color: 'text-blue-500'
  },
  {
    title: 'Average Rating',
    value: '4.9',
    change: '+0.1',
    trend: 'up',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    title: 'Response Time',
    value: '2.3h',
    change: '-0.5h',
    trend: 'up',
    icon: Clock,
    color: 'text-purple-500'
  }
];

const recentProjects = [
  {
    title: 'DeFi Dashboard Development',
    client: 'DeFi Capital Partners',
    status: 'completed',
    earnings: 3500,
    rating: 5,
    completedDate: '2024-06-15'
  },
  {
    title: 'Smart Contract Audit',
    client: 'ArtBlock Studios',
    status: 'in-progress',
    earnings: 6500,
    progress: 75,
    dueDate: '2024-07-10'
  },
  {
    title: 'Cross-Chain Bridge',
    client: 'MultiChain Labs',
    status: 'completed',
    earnings: 10000,
    rating: 4.8,
    completedDate: '2024-05-28'
  }
];

const skillPerformance = [
  { skill: 'Solidity', level: 9, projects: 15, earnings: 45000, growth: '+15%' },
  { skill: 'React', level: 8, projects: 22, earnings: 38000, growth: '+8%' },
  { skill: 'Web3.js', level: 8, projects: 18, earnings: 32000, growth: '+12%' },
  { skill: 'DeFi', level: 9, projects: 12, earnings: 42000, growth: '+20%' }
];

export default function Analytics() {
  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your performance and earnings</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <Card key={index} className="web3-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </Card>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="web3-card p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Projects</h2>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 'secondary'}
                          className={project.status === 'completed' ? 'bg-green-500/10 text-green-500' : ''}
                        >
                          {project.status}
                        </Badge>
                        {project.status === 'completed' && project.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{project.rating}</span>
                          </div>
                        )}
                        {project.status === 'in-progress' && project.progress && (
                          <span className="text-sm text-muted-foreground">{project.progress}% complete</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">${project.earnings.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.status === 'completed' ? project.completedDate : `Due ${project.dueDate}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Skill Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="web3-card p-6">
              <h2 className="text-xl font-semibold mb-6">Skill Performance</h2>
              <div className="space-y-4">
                {skillPerformance.map((skill, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{skill.skill}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Level {skill.level}</Badge>
                        <span className="text-sm text-green-500">{skill.growth}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Projects: </span>
                        <span className="font-medium">{skill.projects}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Earnings: </span>
                        <span className="font-medium">${skill.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* MasChain Integration Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="web3-card p-6">
            <h2 className="text-xl font-semibold mb-6">MasChain Integration</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">3</div>
                <div className="text-sm text-muted-foreground">Trust NFTs</div>
                <div className="text-xs text-green-500 mt-1">$20K verified work</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">92</div>
                <div className="text-sm text-muted-foreground">Trust Score</div>
                <div className="text-xs text-green-500 mt-1">+15 from KYC</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">$12.8K</div>
                <div className="text-sm text-muted-foreground">Skill Token Value</div>
                <div className="text-xs text-green-500 mt-1">4 verified skills</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
