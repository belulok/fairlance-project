'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedNumber({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="text-4xl md:text-6xl font-bold gradient-text">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function Stats() {
  const stats = [
    {
      value: 0,
      suffix: '%',
      label: 'Platform Fees',
      description: 'Unlike traditional platforms that charge up to 20%',
      icon: '💰',
    },
    {
      value: 5,
      suffix: 's',
      label: 'Payment Time',
      description: 'Instant smart contract execution vs days of waiting',
      icon: '⚡',
    },
    {
      value: 100,
      suffix: '%',
      label: 'Transparent',
      description: 'All transactions visible on blockchain',
      icon: '🔍',
    },
    {
      value: 24,
      suffix: '/7',
      label: 'Available',
      description: 'Global, decentralized, always accessible',
      icon: '🌍',
    },
  ];

  return (
    <section id="stats" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="gradient-text">FairLance</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the future of freelancing with revolutionary improvements over traditional platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <motion.div
                className="text-4xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {stat.icon}
              </motion.div>
              
              <div className="mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {stat.label}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-slate-800/30 to-purple-900/30 rounded-3xl p-8 md:p-12 border border-purple-500/20"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Traditional vs <span className="gradient-text">FairLance</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Platforms */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                Traditional Platforms
              </h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  Up to 20% platform fees
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  3-7 days payment processing
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  Opaque dispute resolution
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  Centralized control
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">✗</span>
                  Limited payment options
                </div>
              </div>
            </div>

            {/* FairLance */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                FairLance
              </h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  0% platform fees
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Instant smart contract payments
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Transparent blockchain arbitration
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Decentralized & trustless
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Multiple cryptocurrencies
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
