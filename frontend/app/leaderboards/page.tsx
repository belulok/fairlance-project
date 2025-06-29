'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Star, TrendingUp, Crown } from 'lucide-react';

const skillLeaderboards = {
  'Solidity': [
    {
      rank: 1,
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      skillLevel: 10,
      tokenBalance: 1850,
      projectsCompleted: 15,
      averageRating: 4.95,
      trustScore: 98,
      isCurrentUser: true
    },
    {
      rank: 2,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      skillLevel: 9,
      tokenBalance: 1620,
      projectsCompleted: 18,
      averageRating: 4.9,
      trustScore: 95
    },
    {
      rank: 3,
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      skillLevel: 9,
      tokenBalance: 1450,
      projectsCompleted: 12,
      averageRating: 4.92,
      trustScore: 93
    }
  ],
  'React': [
    {
      rank: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      skillLevel: 9,
      tokenBalance: 1450,
      projectsCompleted: 22,
      averageRating: 4.88,
      trustScore: 95
    },
    {
      rank: 2,
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      skillLevel: 8,
      tokenBalance: 1250,
      projectsCompleted: 12,
      averageRating: 4.8,
      trustScore: 98,
      isCurrentUser: true
    },
    {
      rank: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      skillLevel: 8,
      tokenBalance: 1180,
      projectsCompleted: 16,
      averageRating: 4.85,
      trustScore: 89
    }
  ]
};

const globalStats = [
  {
    title: 'Top Earner',
    value: 'Alex Johnson',
    subtitle: '$125K total earnings',
    icon: Crown,
    color: 'text-yellow-500'
  },
  {
    title: 'Most Projects',
    value: 'Sarah Chen',
    subtitle: '34 completed projects',
    icon: Trophy,
    color: 'text-blue-500'
  },
  {
    title: 'Highest Rating',
    value: 'Mike Rodriguez',
    subtitle: '4.95/5 average rating',
    icon: Star,
    color: 'text-purple-500'
  },
  {
    title: 'Rising Star',
    value: 'Emma Wilson',
    subtitle: '+25% growth this month',
    icon: TrendingUp,
    color: 'text-green-500'
  }
];

export default function Leaderboards() {
  const skills = Object.keys(skillLeaderboards);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Skill Leaderboards</h1>
          <p className="text-muted-foreground">See how you rank against other freelancers</p>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="web3-card p-6 text-center">
                <div className={`w-12 h-12 rounded-full bg-opacity-10 flex items-center justify-center mx-auto mb-4 ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="font-semibold mb-1">{stat.title}</div>
                <div className="text-lg font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
              </Card>
            );
          })}
        </motion.div>

        {/* Skill Leaderboards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {skills.map((skill, skillIndex) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + skillIndex * 0.1 }}
            >
              <Card className="web3-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{skill} Leaderboard</h2>
                    <p className="text-sm text-muted-foreground">Top performers this month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {skillLeaderboards[skill].map((user, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                        user.isCurrentUser 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/50 hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{user.name}</span>
                          {user.isCurrentUser && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Level {user.skillLevel}</span>
                          <span>{user.projectsCompleted} projects</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{Number(user.averageRating).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          {user.tokenBalance} tokens
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Trust: {user.trustScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-center text-sm text-muted-foreground">
                    Rankings updated every 24 hours
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* MasChain Integration Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="web3-card p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">MasChain Verified Rankings</h3>
            <p className="text-muted-foreground mb-4">
              All rankings are based on verified skill tokens and Trust NFTs stored on MasChain blockchain.
              Your achievements are cryptographically verified and tamper-proof.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Tamper Proof</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
