'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Zap, CheckCircle, DollarSign, FileText, GitBranch } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Users,
    title: "1. Connect & Verify",
    description: "Connect your Web3 wallet and complete MasChain eKYC verification for enhanced trust and credibility.",
    features: ["Government-backed identity verification", "+15 trust score boost", "Access to premium projects"]
  },
  {
    icon: FileText,
    title: "2. Browse & Apply",
    description: "Explore verified projects from trusted clients and submit proposals with your portfolio and rates.",
    features: ["Curated project marketplace", "Verified client profiles", "Smart matching algorithm"]
  },
  {
    icon: Shield,
    title: "3. Smart Contract Escrow",
    description: "Once hired, funds are automatically locked in smart contracts with milestone-based releases.",
    features: ["Automated escrow system", "Milestone-based payments", "Dispute resolution mechanism"]
  },
  {
    icon: GitBranch,
    title: "4. Submit & Verify",
    description: "Submit deliverables via GitHub commits or IPFS for transparent, verifiable proof of work.",
    features: ["Cryptographic verification", "Immutable work records", "Automated quality checks"]
  },
  {
    icon: CheckCircle,
    title: "5. Get Paid Instantly",
    description: "Upon client approval, payments are released instantly to your wallet with zero platform fees.",
    features: ["Instant cryptocurrency payments", "Zero platform fees", "Global accessibility"]
  },
  {
    icon: Zap,
    title: "6. Build Reputation",
    description: "Earn Trust NFTs and skill tokens that create a portable, verifiable reputation across platforms.",
    features: ["Trust NFT certificates", "Skill token rewards", "Portable reputation system"]
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            How FairLance Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of freelancing with blockchain-powered trust, instant payments, and verifiable reputation.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="web3-card p-8">
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="rounded-full bg-primary/10 p-3 text-primary">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-bold">{step.title}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <step.icon className="h-32 w-32 text-primary/50" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="web3-card p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of freelancers and clients building the future of work on FairLance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="web3-button group" asChild>
                <Link href="/projects">
                  Browse Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" className="web3-button" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
