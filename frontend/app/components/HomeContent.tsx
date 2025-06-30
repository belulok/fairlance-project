'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Zap, ChevronRight, Sparkles, ExternalLink, DollarSign, Globe, Code } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { MasChainConnectButton } from '@/app/components/MasChainConnectButton';
import { useEffect, useState } from 'react';

// Mock featured projects data
const featuredProjects = [
  {
    id: 1,
    title: "Build DeFi Dashboard",
    description: "Create a modern DeFi dashboard with real-time analytics and portfolio tracking...",
    budget: "500 USDC",
    deadline: new Date(Date.now() + 172800000), // 2 days from now
  },
  {
    id: 2,
    title: "Smart Contract Audit",
    description: "Security audit for NFT marketplace smart contracts with comprehensive testing...",
    budget: "1200 USDC",
    deadline: new Date(Date.now() + 259200000), // 3 days from now
  },
  {
    id: 3,
    title: "Web3 Mobile App",
    description: "React Native app for decentralized social media platform with wallet integration...",
    budget: "2000 USDC",
    deadline: new Date(Date.now() + 345600000), // 4 days from now
  }
];

const features = [
  {
    icon: Shield,
    title: "Smart Contract Escrow",
    description: "Funds are automatically held in secure smart contracts until work is completed",
    link: "/how-it-works"
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Get paid immediately upon project approval through automated smart contracts",
    link: "/features"
  },
  {
    icon: DollarSign,
    title: "Zero Platform Fees",
    description: "Keep 100% of your earnings with no hidden fees or commission cuts",
    link: "/features"
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    description: "Work with clients worldwide without geographical or payment restrictions",
    link: "/features"
  },
  {
    icon: Users,
    title: "Trustless Collaboration",
    description: "No need to trust intermediaries - smart contracts ensure fair execution",
    link: "/features"
  },
  {
    icon: Code,
    title: "Verifiable Deliverables",
    description: "Submit work via GitHub commits or IPFS for transparent verification",
    link: "/features"
  }
];

function FeatureCard({ icon: Icon, title, description, link }: { 
  icon: any;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="web3-card group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <Link href={link} className="block">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <div className="relative">
          <div className="mb-4 inline-block rounded-full bg-primary/10 p-3 text-primary group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Safe hook wrapper that handles provider errors
function useSafeAccount() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const checkMasChainConnection = () => {
      const masChainWallet = localStorage.getItem('maschain_wallet');
      if (masChainWallet) {
        try {
          const walletData = JSON.parse(masChainWallet);
          if (walletData.address) {
            setIsConnected(true);
            setAddress(walletData.address);
          }
        } catch (error) {
          console.error('Error parsing MasChain wallet data:', error);
        }
      }
    };

    checkMasChainConnection();
  }, []);

  return { isConnected, address };
}

export function HomeContent() {
  const { isConnected } = useSafeAccount();
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProjectIndex((current) =>
        current === featuredProjects.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
          </div>

          {/* Hero Banner Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-16 overflow-hidden mb-20">
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-2"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium">Revolutionizing Freelancing</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
                  >
                    Smart Contract Escrow
                    <span className="block text-primary mt-2 relative">
                      <span className="absolute inset-0 animate-pulse-slow bg-primary/20 blur-xl" />
                      <span className="relative">for Freelancers</span>
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg text-muted-foreground max-w-xl"
                  >
                    Experience the future of freelancing with zero fees, instant payments, and trustless
                    transactions powered by blockchain technology.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <MasChainConnectButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" />
                    {isConnected && (
                      <Link href="/projects">
                        <Button className="web3-button group">
                          Browse Projects
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="grid grid-cols-3 gap-6 pt-8"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                        className="text-2xl md:text-3xl font-bold text-primary"
                      >
                        100%
                      </motion.div>
                      <div className="text-sm text-muted-foreground">Your Earnings</div>
                    </div>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                        className="text-2xl md:text-3xl font-bold text-primary"
                      >
                        0%
                      </motion.div>
                      <div className="text-sm text-muted-foreground">Platform Fees</div>
                    </div>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                        className="text-2xl md:text-3xl font-bold text-primary"
                      >
                        24/7
                      </motion.div>
                      <div className="text-sm text-muted-foreground">Availability</div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Content - Animated Visual */}
                <div className="relative hidden lg:block">
                  <div className="relative h-96">
                    {/* Main Visual Container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl"
                    />

                    {/* Floating Elements */}
                    <motion.div
                      initial={{ opacity: 0, x: 50, y: -20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                      className="absolute top-8 right-8 bg-white rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Secure Escrow</div>
                          <div className="text-xs text-muted-foreground">Smart Contract Protected</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -50, y: 20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.8, type: "spring" }}
                      className="absolute bottom-20 left-8 bg-white rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Instant Payment</div>
                          <div className="text-xs text-muted-foreground">Automated Release</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                      className="absolute bottom-8 right-12 bg-white rounded-xl p-3 shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Zero Fees</span>
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <DollarSign className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Animated Background Elements */}
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute top-16 left-16 w-16 h-16 border-2 border-primary/20 rounded-full"
                    />

                    <motion.div
                      animate={{
                        rotate: -360,
                        scale: [1, 0.8, 1]
                      }}
                      transition={{
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute bottom-16 right-20 w-12 h-12 border-2 border-primary/30 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute top-10 left-10 w-20 h-20 border border-primary rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute top-32 right-20 w-16 h-16 border border-primary rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-20 left-32 w-12 h-12 border border-primary rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Project</h2>
              <Button variant="outline" className="web3-button group" asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProjectIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="web3-card">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{featuredProjects[currentProjectIndex].title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {featuredProjects[currentProjectIndex].description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-semibold">
                          {featuredProjects[currentProjectIndex].budget}
                        </span>
                        <span className="text-muted-foreground">
                          Due in {Math.ceil((featuredProjects[currentProjectIndex].deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button className="web3-button" asChild>
                        <Link href={`/project/${featuredProjects[currentProjectIndex].id}`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
