const axios = require('axios');
const crypto = require('crypto');

class MasChainService {
  constructor() {
    this.baseURL = process.env.MASCHAIN_API_URL || 'https://service-testnet.maschain.com';
    this.apiKey = process.env.MASCHAIN_API_KEY;
    this.apiSecret = process.env.MASCHAIN_API_SECRET;
  }

  // Generate authentication headers
  generateAuthHeaders(method, endpoint, body = '') {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Create signature string
    const signatureString = `${method.toUpperCase()}${endpoint}${body}${timestamp}${nonce}`;
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(signatureString)
      .digest('hex');

    return {
      'X-API-KEY': this.apiKey,
      'X-TIMESTAMP': timestamp,
      'X-NONCE': nonce,
      'X-SIGNATURE': signature,
      'Content-Type': 'application/json'
    };
  }

  // Generic API call method
  async makeRequest(method, endpoint, data = null) {
    try {
      const body = data ? JSON.stringify(data) : '';
      const headers = this.generateAuthHeaders(method, endpoint, body);
      
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers,
        ...(data && { data })
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('MasChain API Error:', error.response?.data || error.message);
      throw new Error(`MasChain API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Wallet Management Services
  async createWallet(entityId, walletCategory = 'user') {
    return this.makeRequest('POST', '/api/wallet/create', {
      entity_id: entityId,
      wallet_category: walletCategory
    });
  }

  async getWallet(walletId) {
    return this.makeRequest('GET', `/api/wallet/${walletId}`);
  }

  async getWalletsByEntity(entityId) {
    return this.makeRequest('GET', `/api/wallet/entity/${entityId}`);
  }

  // e-KYC Services
  async initiateKYC(userData) {
    return this.makeRequest('POST', '/api/ekyc/initiate', {
      user_id: userData.userId,
      callback_url: userData.callbackUrl,
      redirect_url: userData.redirectUrl
    });
  }

  async getKYCStatus(kycId) {
    return this.makeRequest('GET', `/api/ekyc/status/${kycId}`);
  }

  // Certificate Management (for Trust NFTs)
  async issueCertificate(certificateData) {
    return this.makeRequest('POST', '/api/certificate/issue', {
      recipient_wallet: certificateData.recipientWallet,
      certificate_type: certificateData.type,
      metadata: certificateData.metadata,
      attributes: certificateData.attributes
    });
  }

  async getCertificate(certificateId) {
    return this.makeRequest('GET', `/api/certificate/${certificateId}`);
  }

  async getCertificatesByWallet(walletAddress) {
    return this.makeRequest('GET', `/api/certificate/wallet/${walletAddress}`);
  }

  // Token Management (for Skill Tokens)
  async createToken(tokenData) {
    return this.makeRequest('POST', '/api/token/create', {
      name: tokenData.name,
      symbol: tokenData.symbol,
      total_supply: tokenData.totalSupply,
      decimals: tokenData.decimals || 18,
      metadata: tokenData.metadata
    });
  }

  async mintToken(tokenAddress, recipientWallet, amount) {
    return this.makeRequest('POST', '/api/token/mint', {
      token_address: tokenAddress,
      recipient: recipientWallet,
      amount: amount
    });
  }

  async getTokenBalance(tokenAddress, walletAddress) {
    return this.makeRequest('GET', `/api/token/balance/${tokenAddress}/${walletAddress}`);
  }

  // Custom Smart Contract (for Escrow)
  async deployContract(contractData) {
    return this.makeRequest('POST', '/api/contract/deploy', {
      contract_name: contractData.name,
      contract_code: contractData.code,
      constructor_params: contractData.constructorParams,
      metadata: contractData.metadata
    });
  }

  async callContract(contractAddress, method, params, fromWallet) {
    return this.makeRequest('POST', '/api/contract/call', {
      contract_address: contractAddress,
      method: method,
      parameters: params,
      from_wallet: fromWallet
    });
  }

  async getContractState(contractAddress) {
    return this.makeRequest('GET', `/api/contract/state/${contractAddress}`);
  }

  // Audit Trail (for Proof-of-Work verification)
  async createAuditRecord(auditData) {
    return this.makeRequest('POST', '/api/audit/create', {
      entity_id: auditData.entityId,
      action: auditData.action,
      metadata: auditData.metadata,
      hash: auditData.hash,
      timestamp: auditData.timestamp
    });
  }

  async getAuditTrail(entityId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.makeRequest('GET', `/api/audit/entity/${entityId}?${queryParams}`);
  }
}

module.exports = new MasChainService();
