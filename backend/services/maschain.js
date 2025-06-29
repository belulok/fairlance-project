const axios = require('axios');
const crypto = require('crypto');

class MasChainService {
  constructor() {
    this.baseURL = process.env.MASCHAIN_API_URL;
    this.portalURL = process.env.MASCHAIN_PORTAL_URL;
    this.explorerURL = process.env.MASCHAIN_EXPLORER_URL;
    
    // API credentials for different services
    this.credentials = {
      wallet: {
        apiKey: process.env.MASCHAIN_WALLET_API_KEY,
        apiSecret: process.env.MASCHAIN_WALLET_API_SECRET
      },
      token: {
        apiKey: process.env.MASCHAIN_TOKEN_API_KEY,
        apiSecret: process.env.MASCHAIN_TOKEN_API_SECRET
      },
      kyc: {
        apiKey: process.env.MASCHAIN_KYC_API_KEY,
        apiSecret: process.env.MASCHAIN_KYC_API_SECRET
      },
      contract: {
        apiKey: process.env.MASCHAIN_CONTRACT_API_KEY,
        apiSecret: process.env.MASCHAIN_CONTRACT_API_SECRET
      }
    };
  }

  // Generate authentication headers for MasChain API
  generateAuthHeaders(service, method, endpoint, body = '') {
    const timestamp = Date.now().toString();
    const creds = this.credentials[service];
    
    if (!creds.apiKey || !creds.apiSecret) {
      throw new Error(`MasChain ${service} credentials not configured`);
    }

    // Create signature string
    const signatureString = `${method}${endpoint}${timestamp}${body}`;
    const signature = crypto
      .createHmac('sha256', creds.apiSecret)
      .update(signatureString)
      .digest('hex');

    return {
      'X-API-KEY': creds.apiKey,
      'X-SIGNATURE': signature,
      'X-TIMESTAMP': timestamp,
      'Content-Type': 'application/json'
    };
  }

  // Wallet Management Service
  async createWallet(userId, walletName) {
    try {
      const endpoint = '/api/wallet/create-wallet';
      const body = JSON.stringify({
        user_id: userId,
        wallet_name: walletName || `FairLance_${userId}`,
        callback_url: `${process.env.BACKEND_URL}/api/maschain/wallet-callback`
      });

      const headers = this.generateAuthHeaders('wallet', 'POST', endpoint, body);
      
      const response = await axios.post(`${this.baseURL}${endpoint}`, JSON.parse(body), {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Create Wallet Error:', error.response?.data || error.message);
      throw new Error('Failed to create MasChain wallet');
    }
  }

  async getWalletBalance(walletAddress) {
    try {
      const endpoint = `/api/wallet/wallet-balance/${walletAddress}`;
      const headers = this.generateAuthHeaders('wallet', 'GET', endpoint);
      
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Get Balance Error:', error.response?.data || error.message);
      throw new Error('Failed to get wallet balance');
    }
  }

  // Token Management Service
  async createToken(tokenData) {
    try {
      const endpoint = '/api/token/create-token';
      const body = JSON.stringify({
        token_name: tokenData.name,
        token_symbol: tokenData.symbol,
        total_supply: tokenData.totalSupply,
        decimals: tokenData.decimals || 18,
        callback_url: `${process.env.BACKEND_URL}/api/maschain/token-callback`
      });

      const headers = this.generateAuthHeaders('token', 'POST', endpoint, body);
      
      const response = await axios.post(`${this.baseURL}${endpoint}`, JSON.parse(body), {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Create Token Error:', error.response?.data || error.message);
      throw new Error('Failed to create token');
    }
  }

  async transferToken(fromWallet, toWallet, tokenAddress, amount) {
    try {
      const endpoint = '/api/token/transfer-token';
      const body = JSON.stringify({
        from_wallet: fromWallet,
        to_wallet: toWallet,
        token_contract_address: tokenAddress,
        amount: amount.toString(),
        callback_url: `${process.env.BACKEND_URL}/api/maschain/transfer-callback`
      });

      const headers = this.generateAuthHeaders('token', 'POST', endpoint, body);
      
      const response = await axios.post(`${this.baseURL}${endpoint}`, JSON.parse(body), {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('MasChain Transfer Token Error:', error.response?.data || error.message);
      throw new Error('Failed to transfer token');
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
