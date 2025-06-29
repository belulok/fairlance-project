'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Shield, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';

export function MasChainConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate MasChain connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full"
      >
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium text-green-400">MasChain Connected</span>
        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
          eKYC Verified
        </Badge>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant="outline"
      size="sm"
      className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting to MasChain...
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Connect MasChain
        </>
      )}
    </Button>
  );
}

export function MasChainStatus() {
  return (
    <Card className="web3-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold">MasChain Integration</h3>
            <p className="text-sm text-muted-foreground">Malaysia's National Blockchain</p>
          </div>
        </div>
        <div className="text-right">
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            eKYC Verified
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Trust Score: 95</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Card>
  );
}
