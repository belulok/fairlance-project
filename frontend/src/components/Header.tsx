'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MasChainConnect } from './MasChainConnect';

export function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-purple-400" />
              <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold gradient-text">FairLance</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#features" 
              className="text-gray-300 hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              className="text-gray-300 hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              How It Works
            </motion.a>
            <motion.a 
              href="#stats" 
              className="text-gray-300 hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Stats
            </motion.a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* MasChain Integration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MasChainConnect />
            </motion.div>

            {/* Connect Wallet Button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 10 }}
            >
              {mounted ? (
                <ConnectButton />
              ) : (
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Connect Wallet
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
