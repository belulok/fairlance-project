// MasChain Frontend Service
class MasChainService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  }

  // Helper method to make authenticated API calls
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }

    return response.json();
  }

  // Health Check
  async healthCheck() {
    return this.apiCall('/maschain/health');
  }

  // Wallet Management
  async createWallet(walletName?: string) {
    return this.apiCall('/maschain/wallet/create', {
      method: 'POST',
      body: JSON.stringify({ walletName }),
    });
  }

  async getWalletBalance(address: string) {
    return this.apiCall(`/maschain/wallet/balance/${address}`);
  }

  // Token Management
  async createToken(tokenData: {
    name: string;
    symbol: string;
    totalSupply: number;
    decimals?: number;
  }) {
    return this.apiCall('/maschain/token/create', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  }

  async transferToken(transferData: {
    fromWallet: string;
    toWallet: string;
    tokenAddress: string;
    amount: number;
  }) {
    return this.apiCall('/maschain/token/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  // KYC Management
  async initiateKYC(kycData: {
    fullName: string;
    email: string;
    phone: string;
  }) {
    return this.apiCall('/maschain/kyc/initiate', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async getKYCStatus() {
    return this.apiCall('/maschain/kyc/status');
  }

  // Smart Contract Management
  async deployEscrowContract(contractData: {
    projectId: string;
    clientWallet: string;
    freelancerWallet: string;
    amount: number;
    deadline: string;
    milestones?: any[];
  }) {
    return this.apiCall('/maschain/contract/escrow/deploy', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }

  // Utility Methods
  getExplorerURL(txHash: string) {
    return `${this.apiUrl}/maschain/explorer/${txHash}`;
  }

  getPortalURL() {
    return `${this.apiUrl}/maschain/portal`;
  }
}

// Export singleton instance
export const masChainService = new MasChainService();

// React Hook for MasChain
import { useState, useEffect } from 'react';

export interface MasChainStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  walletAddress?: string;
  kycStatus?: 'pending' | 'verified' | 'rejected' | 'not_started';
}

export function useMasChain() {
  const [status, setStatus] = useState<MasChainStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkMasChainStatus();
  }, []);

  const checkMasChainStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const health = await masChainService.healthCheck();
      const kycStatus = await masChainService.getKYCStatus();
      
      setStatus({
        isConnected: health.success,
        isLoading: false,
        error: null,
        kycStatus: kycStatus.data?.status || 'not_started',
      });
    } catch (error: any) {
      setStatus({
        isConnected: false,
        isLoading: false,
        error: error.message,
      });
    }
  };

  const createWallet = async (walletName?: string) => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true }));
      const result = await masChainService.createWallet(walletName);
      
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        walletAddress: result.data?.wallet_address,
      }));
      
      return result;
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const initiateKYC = async (kycData: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true }));
      const result = await masChainService.initiateKYC(kycData);
      
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        kycStatus: 'pending',
      }));
      
      return result;
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  return {
    ...status,
    createWallet,
    initiateKYC,
    refreshStatus: checkMasChainStatus,
    masChainService,
  };
}
