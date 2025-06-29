'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Users, Lock, Code, DollarSign, Clock } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Smart Contract Escrow',
      description: 'Funds are automatically held in a secure smart contract until work is completed and approved.',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'No more waiting days for payment processing. Smart contracts execute payments instantly upon approval.',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      icon: DollarSign,
      title: 'Zero Platform Fees',
      description: 'Keep 100% of your earnings. No hidden fees, no commission cuts, just pure value exchange.',
      color: 'green',
      gradient: 'from-green-500 to-green-700',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Work with anyone, anywhere in the world. Blockchain technology removes geographical barriers.',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-700',
    },
    {
      icon: Lock,
      title: 'Trustless Security',
      description: 'No need to trust a third party. Smart contracts ensure automatic and fair execution of agreements.',
      color: 'red',
      gradient: 'from-red-500 to-red-700',
    },
    {
      icon: Code,
      title: 'Verifiable Work',
      description: 'Submit work via GitHub commits or IPFS hashes for transparent and verifiable deliverables.',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-700',
    },
    {
      icon: Users,
      title: 'DAO Arbitration',
      description: 'Disputes are resolved by decentralized autonomous organization voting for fair outcomes.',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-700',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'The platform never sleeps. Create projects, submit work, and receive payments anytime.',
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-700',
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionary <span className="gradient-text">Features</span>
          </h2>
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-400">Built on Malaysia's National Blockchain Infrastructure</span>
              <div className="px-2 py-1 bg-blue-500/20 rounded text-xs font-bold text-blue-300">MasChain</div>
            </div>
          </motion.div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how blockchain technology transforms the freelancing experience with cutting-edge features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-4 relative z-10`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 border border-purple-500/20">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and clients who have already discovered the power of decentralized work.
            </p>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold glow-purple hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
