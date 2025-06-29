'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Zap, ChevronRight, Sparkles, ExternalLink, DollarSign, Globe, Clock, Code } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

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
    link: "#how-it-works"
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Get paid immediately upon project approval through automated smart contracts",
    link: "#features"
  },
  {
    icon: DollarSign,
    title: "Zero Platform Fees",
    description: "Keep 100% of your earnings with no hidden fees or commission cuts",
    link: "#features"
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    description: "Work with clients worldwide without geographical or payment restrictions",
    link: "#features"
  },
  {
    icon: Users,
    title: "Trustless Collaboration",
    description: "No need to trust intermediaries - smart contracts ensure fair execution",
    link: "#features"
  },
  {
    icon: Code,
    title: "Verifiable Deliverables",
    description: "Submit work via GitHub commits or IPFS for transparent verification",
    link: "#features"
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

export default function Home() {
  const { isConnected } = useAccount();
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProjectIndex((current) =>
        current === featuredProjects.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen gradient-bg hexagon-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-2"
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Revolutionizing Freelancing</span>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-blue-500/5 px-6 py-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-400">Powered by Malaysia's National Blockchain</span>
              <div className="px-2 py-1 bg-blue-500/20 rounded text-xs font-bold text-blue-300">MasChain</div>
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Smart Contract Escrow
              <span className="relative ml-2 inline-block animate-float">
                <span className="absolute inset-0 animate-pulse-slow bg-primary/20 blur-xl" />
                <span className="relative text-primary">for Freelancers</span>
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Experience the future of freelancing with zero fees, instant payments, and trustless
              transactions powered by blockchain technology.
            </p>

            <div className="flex justify-center gap-4">
              <ConnectWalletButton />
              {isConnected && (
                <Link href="/projects">
                  <Button className="web3-button group">
                    Browse Projects
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* Featured Project */}
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

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How FairLance Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience seamless, trustless freelancing in just four simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Create Project",
                  description: "Client creates a project and deposits funds into smart contract escrow",
                  icon: "💼"
                },
                {
                  step: "2",
                  title: "Accept Work",
                  description: "Freelancer reviews and accepts the project. Funds are now secured",
                  icon: "🤝"
                },
                {
                  step: "3",
                  title: "Submit Work",
                  description: "Complete work and submit via GitHub commit or IPFS hash",
                  icon: "📤"
                },
                {
                  step: "4",
                  title: "Get Paid",
                  description: "Client approves and smart contract instantly releases payment",
                  icon: "💰"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="web3-card text-center"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose FairLance?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Revolutionary improvements over traditional freelance platforms
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "0%", label: "Platform Fees", description: "Unlike traditional platforms that charge up to 20%" },
                { value: "5s", label: "Payment Time", description: "Instant smart contract execution vs days of waiting" },
                { value: "100%", label: "Transparent", description: "All transactions visible on blockchain" },
                { value: "24/7", label: "Available", description: "Global, decentralized, always accessible" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="web3-card text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
