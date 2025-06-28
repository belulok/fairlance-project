'use client';

import { motion } from 'framer-motion';
import { PlusCircle, UserCheck, Upload, CheckCircle, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: PlusCircle,
      title: 'Create Project',
      description: 'Client creates a project and deposits USDC into the smart contract escrow.',
      details: ['Define project requirements', 'Set payment amount', 'Funds locked in smart contract'],
      color: 'purple',
    },
    {
      icon: UserCheck,
      title: 'Accept Work',
      description: 'Freelancer reviews and accepts the project. Funds are now secured.',
      details: ['Browse available projects', 'Submit proposal', 'Get selected by client'],
      color: 'blue',
    },
    {
      icon: Upload,
      title: 'Submit Work',
      description: 'Freelancer completes work and submits via GitHub commit or IPFS hash.',
      details: ['Complete the project', 'Upload to GitHub/IPFS', 'Submit proof of work'],
      color: 'green',
    },
    {
      icon: CheckCircle,
      title: 'Get Paid',
      description: 'Client approves work and smart contract instantly releases payment.',
      details: ['Client reviews submission', 'Approves completed work', 'Instant payment release'],
      color: 'yellow',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span className="gradient-text">FairLance</span> Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience seamless, trustless freelancing in just four simple steps
          </p>
        </motion.div>

        {/* Desktop Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-yellow-500 transform -translate-y-1/2" />
            
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Step Number */}
                    <motion.div
                      className={`w-16 h-16 bg-${step.color}-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {index + 1}
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className={`w-12 h-12 bg-${step.color}-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                        <Icon className={`w-6 h-6 text-${step.color}-400`} />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-3 text-center">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 text-center">
                        {step.description}
                      </p>

                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-500 text-xs flex items-center">
                            <span className={`w-1.5 h-1.5 bg-${step.color}-400 rounded-full mr-2`} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute top-8 -right-4 z-20"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-8 h-8 text-purple-400" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-center space-x-4">
                  {/* Step Number */}
                  <motion.div
                    className={`w-12 h-12 bg-${step.color}-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="flex-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 bg-${step.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 text-${step.color}-400`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {step.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-3">
                          {step.description}
                        </p>

                        <ul className="space-y-1">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-gray-500 text-xs flex items-center">
                              <span className={`w-1 h-1 bg-${step.color}-400 rounded-full mr-2`} />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-blue-500 ml-6 mt-4" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Dispute Resolution */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-3xl p-8 border border-red-500/20"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              🛡️ Dispute Resolution
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              In rare cases of disagreement, a pre-selected neutral third-party or DAO vote can act as an arbiter to ensure fair resolution.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                Transparent Process
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2" />
                Community Driven
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                Fair Outcomes
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
