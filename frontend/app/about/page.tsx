'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, PlayCircle, FileCode, Twitter, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "What is this DApp?",
    answer: "This decentralized application (DApp) is a community governance platform that enables token holders to participate in decision-making through transparent and secure on-chain voting. Users can create proposals, vote on active proposals, and track the results of past governance decisions."
  },
  {
    question: "How does voting work?",
    answer: "Each wallet address can vote once per proposal. Votes are recorded on-chain and cannot be changed once submitted. Proposals have a specified duration, and once the deadline is reached, the proposal is automatically closed and the results are finalized."
  },
  {
    question: "Who can create proposals?",
    answer: "Any wallet holding governance tokens can create proposals. To prevent spam, there's a minimum token requirement for proposal creation. Proposals must include a clear title, detailed description, and voting duration."
  },
  {
    question: "How are votes counted?",
    answer: "Each vote carries equal weight in the current implementation. The proposal outcome is determined by simple majority - if there are more 'Yes' votes than 'No' votes when the proposal expires, it passes."
  },
  {
    question: "What happens after a proposal passes?",
    answer: "When a proposal passes, it becomes eligible for execution. The smart contract automatically implements the approved changes for protocol parameters. For treasury allocations or other actions, the designated multisig must execute the proposal within the specified timeframe."
  }
];

const sections = [
  {
    id: "voting-system",
    title: "Decentralized Voting System",
    content: "Our voting system leverages blockchain technology to ensure complete transparency and immutability. Every vote is recorded on-chain and can be verified by anyone at any time. The system is designed to be resistant to manipulation and provides real-time results."
  },
  {
    id: "community",
    title: "Community-Driven Governance",
    content: "We believe in the power of collective decision-making. Our platform enables token holders to actively participate in shaping the future of the protocol. Through open discussions and transparent voting, we ensure that every voice is heard and considered."
  },
  {
    id: "governance",
    title: "On-Chain Governance Framework",
    content: "Our governance framework is built entirely on-chain, ensuring that all decisions and their implementations are verifiable and immutable. This creates a trustless environment where the community can be confident that approved proposals will be executed exactly as voted upon."
  }
];

const contractAddresses = {
  governance: "0x1234...5678",
  token: "0xabcd...efgh",
};

const socialLinks = {
  twitter: "https://twitter.com/yourusername",
  github: "https://github.com/yourusername",
};

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      <h3 className="text-lg font-semibold">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </motion.div>
  );
}

function Section({ id, title, content }: { id: string; title: string; content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      id={id}
      className="scroll-mt-24"
    >
      <Card className="web3-card p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </Card>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen gradient-bg hexagon-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Link href="/proposals" className="mb-8 inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Proposals
            </Link>

            <div className="space-y-12">
              {/* Introduction */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Info className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold">About the DApp</h1>
                </div>
                <Card className="web3-card p-6">
                  <p className="text-lg mb-6">
                    Welcome to our Web3 Governance Platform! This decentralized application empowers 
                    communities to make decisions collectively through transparent and secure blockchain voting.
                  </p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Key Features</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Decentralized proposal creation</li>
                        <li>Secure on-chain voting</li>
                        <li>Real-time results tracking</li>
                        <li>Transparent execution</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Technology Stack</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Next.js & React</li>
                        <li>Ethereum Smart Contracts</li>
                        <li>WalletConnect Integration</li>
                        <li>IPFS Data Storage</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Feature Sections */}
              <div className="space-y-6">
                {sections.map((section) => (
                  <Section key={section.id} {...section} />
                ))}
              </div>

              {/* Demo Video */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <PlayCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Demo & Tutorial</h2>
                </div>
                <Card className="web3-card overflow-hidden">
                  <div className="aspect-video bg-black/20">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/your-video-id"
                      title="DApp Demo Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Card>
              </div>

              {/* Smart Contracts */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <FileCode className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Smart Contracts</h2>
                </div>
                <Card className="web3-card p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Governance Contract</h3>
                      <p className="text-sm text-muted-foreground">{contractAddresses.governance}</p>
                    </div>
                    <Button variant="outline" className="web3-button" asChild>
                      <Link href={`https://polygonscan.com/address/${contractAddresses.governance}`} target="_blank">
                        View on Polygonscan
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Token Contract</h3>
                      <p className="text-sm text-muted-foreground">{contractAddresses.token}</p>
                    </div>
                    <Button variant="outline" className="web3-button" asChild>
                      <Link href={`https://polygonscan.com/address/${contractAddresses.token}`} target="_blank">
                        View on Polygonscan
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>

              {/* FAQ Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Info className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>
                <Card className="web3-card p-6">
                  <div className="space-y-8">
                    {faqs.map((faq, index) => (
                      <FAQ key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </Card>
              </div>

              {/* Credits & Social */}
              <div>
                <Card className="web3-card p-6">
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Connect With Us</h2>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" className="web3-button" asChild>
                        <Link href={socialLinks.twitter} target="_blank">
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Link>
                      </Button>
                      <Button variant="outline" className="web3-button" asChild>
                        <Link href={socialLinks.github} target="_blank">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Link>
                      </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Built with ❤️ by Your Name
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}