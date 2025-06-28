'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Code, 
  Palette, 
  Shield, 
  Zap,
  Award,
  Target,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface SkillToken {
  skill: string;
  level: number;
  balance: number;
  currentBalance?: number;
  tokenAddress: string;
  earnedDate: string;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  trustScore: number;
  skillLevel: number;
  tokenBalance: number;
}

const skillIcons: Record<string, any> = {
  'React': Code,
  'Solidity': Shield,
  'JavaScript': Code,
  'Python': Code,
  'Design': Palette,
  'Marketing': TrendingUp,
  'Security': Shield,
  'Web3': Zap,
  'DeFi': Zap,
  'NFT': Award
};

const getSkillIcon = (skill: string) => {
  return skillIcons[skill] || Code;
};

const getSkillColor = (skill: string) => {
  const colors: Record<string, string> = {
    'React': 'bg-blue-500',
    'Solidity': 'bg-purple-500',
    'JavaScript': 'bg-yellow-500',
    'Python': 'bg-green-500',
    'Design': 'bg-pink-500',
    'Marketing': 'bg-orange-500',
    'Security': 'bg-red-500',
    'Web3': 'bg-indigo-500',
    'DeFi': 'bg-cyan-500',
    'NFT': 'bg-violet-500'
  };
  return colors[skill] || 'bg-gray-500';
};

const getLevelName = (level: number) => {
  if (level >= 10) return 'Expert';
  if (level >= 8) return 'Advanced';
  if (level >= 6) return 'Intermediate';
  if (level >= 4) return 'Beginner+';
  if (level >= 2) return 'Beginner';
  return 'Novice';
};

const getNextLevelTokens = (currentBalance: number) => {
  const thresholds = [50, 100, 200, 500, 1000];
  for (const threshold of thresholds) {
    if (currentBalance < threshold) {
      return threshold;
    }
  }
  return currentBalance + 500; // For expert level
};

export function SkillTokenDashboard() {
  const [skillTokens, setSkillTokens] = useState<SkillToken[]>([]);
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  useEffect(() => {
    loadSkillTokens();
  }, []);

  useEffect(() => {
    if (selectedSkill) {
      loadLeaderboard(selectedSkill);
    }
  }, [selectedSkill]);

  const loadSkillTokens = async () => {
    try {
      setLoading(true);
      const response = await api.getMySkillTokens();
      setSkillTokens(response.skillTokens || []);
      
      if (response.skillTokens?.length > 0) {
        setSelectedSkill(response.skillTokens[0].skill);
      }
    } catch (error) {
      console.error('Failed to load skill tokens:', error);
      toast.error('Failed to load skill tokens');
      // Mock data for demo
      const mockTokens: SkillToken[] = [
        {
          skill: 'React',
          level: 6,
          balance: 250,
          currentBalance: 250,
          tokenAddress: '0x123...',
          earnedDate: new Date().toISOString()
        },
        {
          skill: 'Solidity',
          level: 4,
          balance: 120,
          currentBalance: 120,
          tokenAddress: '0x456...',
          earnedDate: new Date().toISOString()
        },
        {
          skill: 'Web3',
          level: 5,
          balance: 180,
          currentBalance: 180,
          tokenAddress: '0x789...',
          earnedDate: new Date().toISOString()
        }
      ];
      setSkillTokens(mockTokens);
      setSelectedSkill('React');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (skill: string) => {
    try {
      const response = await api.getSkillLeaderboard(skill, 10);
      setLeaderboards(prev => ({
        ...prev,
        [skill]: response.leaderboard || []
      }));
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      // Mock leaderboard data
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          userId: '1',
          username: 'alice_dev',
          name: 'Alice Johnson',
          trustScore: 95,
          skillLevel: 10,
          tokenBalance: 1200
        },
        {
          userId: '2',
          username: 'bob_coder',
          name: 'Bob Smith',
          trustScore: 88,
          skillLevel: 8,
          tokenBalance: 800
        },
        {
          userId: '3',
          username: 'charlie_web3',
          name: 'Charlie Brown',
          trustScore: 82,
          skillLevel: 7,
          tokenBalance: 650
        }
      ];
      setLeaderboards(prev => ({
        ...prev,
        [skill]: mockLeaderboard
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="web3-card animate-pulse">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="web3-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Total Skills</h3>
                <p className="text-2xl font-bold text-primary">{skillTokens.length}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Skills you've demonstrated through completed projects
            </p>
          </div>
        </Card>

        <Card className="web3-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Highest Level</h3>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...skillTokens.map(t => t.level), 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your highest skill level achieved
            </p>
          </div>
        </Card>

        <Card className="web3-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Total Tokens</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {skillTokens.reduce((sum, token) => sum + (token.currentBalance || token.balance), 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total skill tokens earned across all skills
            </p>
          </div>
        </Card>
      </div>

      {/* Skills and Leaderboard */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">My Skills</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {skillTokens.length === 0 ? (
            <Card className="web3-card">
              <div className="p-12 text-center">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Skill Tokens Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Complete projects to earn skill tokens and build your on-chain reputation
                </p>
                <Button className="web3-button">
                  Browse Projects
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillTokens.map((token) => {
                const Icon = getSkillIcon(token.skill);
                const currentBalance = token.currentBalance || token.balance;
                const nextLevelTokens = getNextLevelTokens(currentBalance);
                const progressToNext = Math.min((currentBalance / nextLevelTokens) * 100, 100);

                return (
                  <motion.div
                    key={token.skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="web3-card hover:scale-[1.02] transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 ${getSkillColor(token.skill)} rounded-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{token.skill}</h3>
                              <p className="text-sm text-muted-foreground">
                                Level {token.level} • {getLevelName(token.level)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {currentBalance} tokens
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress to next level</span>
                            <span>{currentBalance}/{nextLevelTokens}</span>
                          </div>
                          <Progress value={progressToNext} className="h-2" />
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Token Address</span>
                            <span className="font-mono">
                              {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          {skillTokens.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {skillTokens.map((token) => (
                <Button
                  key={token.skill}
                  variant={selectedSkill === token.skill ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSkill(token.skill)}
                  className="text-xs"
                >
                  {token.skill}
                </Button>
              ))}
            </div>
          )}

          {selectedSkill && leaderboards[selectedSkill] && (
            <Card className="web3-card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{selectedSkill} Leaderboard</h3>
                </div>

                <div className="space-y-4">
                  {leaderboards[selectedSkill].map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        index < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent border-primary/20' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">@{entry.username}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{entry.tokenBalance} tokens</p>
                        <p className="text-sm text-muted-foreground">
                          Level {entry.skillLevel} • Trust: {entry.trustScore}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
