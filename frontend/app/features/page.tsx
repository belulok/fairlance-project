'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Zap, 
  Award, 
  Users, 
  Code, 
  DollarSign,
  Globe,
  CheckCircle,
  ArrowRight,
  Github,
  Hash,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: "Smart Contract Escrow",
    description: "Automated fund holding with milestone-based releases. Zero platform fees, instant payments upon completion.",
    benefits: ["0% platform fees", "Instant payments", "Automated releases", "Dispute resolution"],
    color: "bg-blue-500",
    demo: "/dashboard"
  },
  {
    icon: Award,
    title: "Trust NFTs",
    description: "Portable reputation certificates that follow you everywhere. Bankable proof of your work quality and reliability.",
    benefits: ["Portable reputation", "Bankable certificates", "Immutable history", "Credit eligibility"],
    color: "bg-purple-500",
    demo: "/dashboard"
  },
  {
    icon: Code,
    title: "Proof-of-Work Verification",
    description: "Submit cryptographic proof via GitHub commits, IPFS hashes, or file URLs. Objective, verifiable deliverables.",
    benefits: ["GitHub integration", "IPFS support", "Immutable proof", "Objective disputes"],
    color: "bg-green-500",
    demo: "/dashboard"
  },
  {
    icon: Users,
    title: "KYC + DID Integration",
    description: "MasChain-powered identity verification with OCR and facial recognition. Fraud-proof profiles without central control.",
    benefits: ["Identity verification", "Fraud prevention", "+10 trust score", "Global access"],
    color: "bg-orange-500",
    demo: "/dashboard"
  },
  {
    icon: TrendingUp,
    title: "Skill Token Economy",
    description: "Earn skill-specific tokens for each completed project. Gamified expertise with verifiable capability levels.",
    benefits: ["Skill tokens", "Level progression", "Leaderboards", "Verifiable skills"],
    color: "bg-indigo-500",
    demo: "/dashboard"
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Work with anyone, anywhere. No geographic restrictions, currency limitations, or payment barriers.",
    benefits: ["Borderless payments", "Multi-currency", "Global talent pool", "24/7 availability"],
    color: "bg-cyan-500",
    demo: "/projects"
  }
];

const comparisons = [
  {
    feature: "Platform Fees",
    traditional: "5-20%",
    fairlance: "0%",
    advantage: "Save $200 on every $1000 project"
  },
  {
    feature: "Payment Time",
    traditional: "7-14 days",
    fairlance: "Instant",
    advantage: "Get paid immediately upon approval"
  },
  {
    feature: "Reputation",
    traditional: "Platform locked",
    fairlance: "Portable NFTs",
    advantage: "Take your reputation anywhere"
  },
  {
    feature: "Work Verification",
    traditional: "Trust-based",
    fairlance: "Cryptographic proof",
    advantage: "Objective, immutable evidence"
  },
  {
    feature: "Dispute Resolution",
    traditional: "Platform decides",
    fairlance: "Smart contract + DAO",
    advantage: "Fair, transparent, automated"
  },
  {
    feature: "Geographic Access",
    traditional: "Restricted",
    fairlance: "Global",
    advantage: "Work with anyone, anywhere"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Revolutionary Features</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Future of
            <span className="text-primary block">Freelancing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            FairLance combines cutting-edge blockchain technology with intuitive design 
            to create the world's first truly decentralized freelance platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="web3-card h-full hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {feature.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href={feature.demo}>
                      <Button className="w-full web3-button group">
                        Try It Now
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              FairLance vs Traditional Platforms
            </h2>
            <p className="text-xl text-muted-foreground">
              See how we're revolutionizing every aspect of freelancing
            </p>
          </div>

          <Card className="web3-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-left p-4 font-semibold">Traditional Platforms</th>
                    <th className="text-left p-4 font-semibold">FairLance</th>
                    <th className="text-left p-4 font-semibold">Your Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison, index) => (
                    <tr key={comparison.feature} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                      <td className="p-4 font-medium">{comparison.feature}</td>
                      <td className="p-4 text-red-600">{comparison.traditional}</td>
                      <td className="p-4 text-green-600 font-semibold">{comparison.fairlance}</td>
                      <td className="p-4 text-muted-foreground">{comparison.advantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Technical Innovation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by MasChain
            </h2>
            <p className="text-xl text-muted-foreground">
              Enterprise-grade blockchain infrastructure for the future of work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="web3-card text-center p-6">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Wallet Management</h3>
              <p className="text-sm text-muted-foreground">Secure user wallet creation and management</p>
            </Card>
            
            <Card className="web3-card text-center p-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">e-KYC Service</h3>
              <p className="text-sm text-muted-foreground">OCR + facial recognition verification</p>
            </Card>
            
            <Card className="web3-card text-center p-6">
              <Code className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smart Contracts</h3>
              <p className="text-sm text-muted-foreground">Custom escrow contract deployment</p>
            </Card>
            
            <Card className="web3-card text-center p-6">
              <Award className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">NFT Certificates</h3>
              <p className="text-sm text-muted-foreground">Trust NFT issuance and verification</p>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="web3-card p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and clients who are already building the decentralized economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button size="lg" className="web3-button">
                  Browse Projects
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
