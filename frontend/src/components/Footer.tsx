'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900/90 border-t border-purple-500/20 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-purple-400" />
                <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold gradient-text">FairLance</span>
            </motion.div>
            <p className="text-gray-400 mb-6 max-w-md">
              The world's first zero-fee freelance platform powered by blockchain technology and government-backed verification.
            </p>
            
            {/* MasChain Integration Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-400">Powered by</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-500/20 rounded text-sm font-bold text-blue-300">
                  MasChain
                </div>
                <span className="text-xs text-gray-400">Malaysia's National Blockchain</span>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="/projects" className="text-gray-400 hover:text-purple-400 transition-colors">Browse Projects</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors">Dashboard</a></li>
              <li><a href="/register" className="text-gray-400 hover:text-purple-400 transition-colors">Sign Up</a></li>
              <li><a href="/how-it-works" className="text-gray-400 hover:text-purple-400 transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Zero Platform Fees</span></li>
              <li><span className="text-gray-400">Instant Payments</span></li>
              <li><span className="text-gray-400">Smart Escrow</span></li>
              <li><span className="text-gray-400">KYC Verification</span></li>
              <li><span className="text-gray-400">Trust NFTs</span></li>
              <li><span className="text-gray-400">Skill Tokens</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 FairLance. Built for the future of work.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Secured by</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-blue-400 font-medium">MasChain Blockchain</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <a href="/terms" className="hover:text-purple-400 transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</a>
                <a href="/support" className="hover:text-purple-400 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
