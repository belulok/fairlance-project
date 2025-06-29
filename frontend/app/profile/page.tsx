'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Globe, Github, Twitter, Save, Camera } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    bio: 'Senior Blockchain Developer with 5+ years experience in DeFi and smart contract development.',
    location: 'Singapore',
    website: 'https://alexjohnson.dev',
    github: 'alexjohnson',
    twitter: 'alexjohnson_dev',
    skills: ['React', 'Solidity', 'Web3.js', 'DeFi', 'TypeScript'],
    hourlyRate: 85
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="web3-button"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="space-y-6">
              <Card className="web3-card p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
                <p className="text-muted-foreground mb-4">{profile.email}</p>
                <Badge className="bg-green-500/10 text-green-500">
                  MasChain Verified
                </Badge>
              </Card>

              <Card className="web3-card p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trust Score</span>
                    <span className="font-semibold">92</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-semibold">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-semibold">4.9/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Earnings</span>
                    <span className="font-semibold">$125K</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="web3-card p-6">
                <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    {isEditing ? (
                      <Input 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profile.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    {isEditing ? (
                      <Input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profile.email}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    {isEditing ? (
                      <Input 
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profile.location}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate (USDC)</label>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={profile.hourlyRate}
                        onChange={(e) => setProfile({...profile, hourlyRate: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">${profile.hourlyRate}</div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {isEditing ? (
                    <Textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">{profile.bio}</div>
                  )}
                </div>
              </Card>

              <Card className="web3-card p-6">
                <h3 className="text-xl font-semibold mb-6">Social Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    {isEditing ? (
                      <Input 
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {profile.website}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    {isEditing ? (
                      <Input 
                        value={profile.github}
                        onChange={(e) => setProfile({...profile, github: e.target.value})}
                        placeholder="username"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        github.com/{profile.github}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    {isEditing ? (
                      <Input 
                        value={profile.twitter}
                        onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                        placeholder="username"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        @{profile.twitter}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="web3-card p-6">
                <h3 className="text-xl font-semibold mb-6">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" className="mt-4">
                    Add Skill
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
