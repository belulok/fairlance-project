const axios = require('axios');
const crypto = require('crypto');

class MasChainService {
  constructor() {
    this.baseURL = process.env.MASCHAIN_API_URL;
    this.portalURL = process.env.MASCHAIN_PORTAL_URL;
    this.explorerURL = process.env.MASCHAIN_EXPLORER_URL;
    
    // API credentials - using single key for all services
    this.apiKey = process.env.MASCHAIN_API_KEY;
    this.apiSecret = process.env.MASCHAIN_API_SECRET;

    // API credentials for different services (fallback to main credentials)
    this.credentials = {
      wallet: {
        apiKey: process.env.MASCHAIN_WALLET_API_KEY || this.apiKey,
        apiSecret: process.env.MASCHAIN_WALLET_API_SECRET || this.apiSecret
      },
      token: {
        apiKey: process.env.MASCHAIN_TOKEN_API_KEY || this.apiKey,
        apiSecret: process.env.MASCHAIN_TOKEN_API_SECRET || this.apiSecret
      },
      contract: {
        apiKey: process.env.MASCHAIN_CONTRACT_API_KEY || this.apiKey,
        apiSecret: process.env.MASCHAIN_CONTRACT_API_SECRET || this.apiSecret
      },
      nft: {
        apiKey: process.env.MASCHAIN_NFT_API_KEY || this.apiKey,
        apiSecret: process.env.MASCHAIN_NFT_API_SECRET || this.apiSecret
      },
      audit: {
        apiKey: process.env.MASCHAIN_AUDIT_API_KEY || this.apiKey,
        apiSecret: process.env.MASCHAIN_AUDIT_API_SECRET || this.apiSecret
      }
    };
  }

  // Generate authentication headers for MasChain API
  generateAuthHeaders(service = 'default') {
    const creds = this.credentials[service] || { apiKey: this.apiKey, apiSecret: this.apiSecret };

    if (!creds.apiKey || !creds.apiSecret) {
      throw new Error(`MasChain ${service} credentials not configured`);
    }

    return {
      'client_id': creds.apiKey,
      'client_secret': creds.apiSecret,
      'Content-Type': 'application/json'
    };
  }

  // Wallet Management Service - MasChain creates and manages wallets server-side
  async createMasChainWallet(userData) {
    try {
      // For MasChain, we need to generate a wallet address first or use organization wallet
      // Let's create a simple wallet identifier for demo purposes
      const walletAddress = this.generateWalletAddress();

      const endpoint = '/api/wallet/create-self-custodian-user';
      const body = {
        name: userData.name,
        email: userData.email,
        wallet_address: walletAddress,
        wallet_name: userData.walletName || `FairLance_${userData.name}`,
        phone: userData.phone || null,
        ic: userData.ic || null
      };

      const headers = this.generateAuthHeaders('wallet');

      const response = await axios.post(`${this.baseURL}${endpoint}`, body, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Create Wallet Error:', error.response?.data || error.message);
      throw new Error('Failed to create MasChain wallet');
    }
  }

  // Generate a demo wallet address (in production, this would be handled differently)
  generateWalletAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  async getMasChainWalletBalance(walletId) {
    try {
      const endpoint = `/api/wallet/balance/${walletId}`;
      const headers = this.generateAuthHeaders('wallet');

      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Get Balance Error:', error.response?.data || error.message);
      throw new Error('Failed to get wallet balance');
    }
  }

  async getWalletTransactions(walletAddress, showFee = 0) {
    try {
      const endpoint = `/api/wallet/get-wallet-transactions?address=${walletAddress}&show_fee=${showFee}`;
      const headers = this.generateAuthHeaders('wallet');

      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Get Transactions Error:', error.response?.data || error.message);
      throw new Error('Failed to get wallet transactions');
    }
  }

  async getTokenTransfers(walletAddress) {
    try {
      const endpoint = `/api/wallet/get-token-transfers?wallet_address=${walletAddress}`;
      const headers = this.generateAuthHeaders('wallet');

      const response = await axios.post(`${this.baseURL}${endpoint}`, {}, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Get Token Transfers Error:', error.response?.data || error.message);
      throw new Error('Failed to get token transfers');
    }
  }

  // Token Management Service
  async transferToken(fromWalletId, toAddress, contractAddress, amount) {
    try {
      const endpoint = '/api/token/token-transfer';
      const body = {
        wallet_address: `wallet_${fromWalletId}`, // MasChain wallet identifier
        to: toAddress, // Can be wallet address or another wallet ID
        contract_address: contractAddress,
        amount: amount.toString(),
        callback_url: `${process.env.BACKEND_URL}/api/maschain/transfer-callback`
      };

      const headers = this.generateAuthHeaders('token');

      const response = await axios.post(`${this.baseURL}${endpoint}`, body, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Transfer Token Error:', error.response?.data || error.message);
      throw new Error('Failed to transfer token');
    }
  }

  async mintToken(walletId, toWalletId, contractAddress, amount) {
    try {
      const endpoint = '/api/token/mint';
      const body = {
        wallet_address: `wallet_${walletId}`, // MasChain wallet identifier
        to: `wallet_${toWalletId}`, // Target wallet identifier
        contract_address: contractAddress,
        amount: amount.toString(),
        callback_url: `${process.env.BACKEND_URL}/api/maschain/mint-callback`
      };

      const headers = this.generateAuthHeaders('token');

      const response = await axios.post(`${this.baseURL}${endpoint}`, body, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Mint Token Error:', error.response?.data || error.message);
      throw new Error('Failed to mint token');
    }
  }

  async getTokenBalance(walletAddress, contractAddress) {
    try {
      const endpoint = '/api/token/balance';
      const body = {
        wallet_address: walletAddress,
        contract_address: contractAddress
      };

      const headers = this.generateAuthHeaders('token');

      const response = await axios.post(`${this.baseURL}${endpoint}`, body, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Get Token Balance Error:', error.response?.data || error.message);
      throw new Error('Failed to get token balance');
    }
  }

  // e-KYC Management Service
  async initiateKYC(userData) {
    try {
      const endpoint = '/api/kyc/initiate-kyc';
      const body = JSON.stringify({
        user_id: userData.userId,
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        callback_url: `${process.env.BACKEND_URL}/api/maschain/kyc-callback`
      });

      const headers = this.generateAuthHeaders('kyc', 'POST', endpoint, body);
      
      const response = await axios.post(`${this.baseURL}${endpoint}`, JSON.parse(body), {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain KYC Error:', error.response?.data || error.message);
      throw new Error('Failed to initiate KYC');
    }
  }

  async getKYCStatus(userId) {
    try {
      const endpoint = `/api/kyc/kyc-status/${userId}`;
      const headers = this.generateAuthHeaders('kyc', 'GET', endpoint);
      
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain KYC Status Error:', error.response?.data || error.message);
      throw new Error('Failed to get KYC status');
    }
  }

  // Smart Contract Service
  async deployEscrowContract(projectData) {
    try {
      const endpoint = '/api/contract/deploy-contract';
      const body = JSON.stringify({
        contract_name: `FairLance_Escrow_${projectData.projectId}`,
        contract_type: 'escrow',
        parameters: {
          client_wallet: projectData.clientWallet,
          freelancer_wallet: projectData.freelancerWallet,
          amount: projectData.amount,
          deadline: projectData.deadline,
          milestones: projectData.milestones
        },
        callback_url: `${process.env.BACKEND_URL}/api/maschain/contract-callback`
      });

      const headers = this.generateAuthHeaders('contract', 'POST', endpoint, body);
      
      const response = await axios.post(`${this.baseURL}${endpoint}`, JSON.parse(body), {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Deploy Contract Error:', error.response?.data || error.message);
      throw new Error('Failed to deploy escrow contract');
    }
  }

  // Utility Methods
  getExplorerURL(txHash) {
    return `${this.explorerURL}/tx/${txHash}`;
  }

  getPortalURL() {
    return this.portalURL;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/api/health`);
      return { status: 'connected', data: response.data };
    } catch (error) {
      return { status: 'disconnected', error: error.message };
    }
  }
}

module.exports = new MasChainService();
