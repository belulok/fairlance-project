// Mock MasChain Service for Demo Purposes
class MockMasChainService {
  constructor() {
    // Mock data storage
    this.mockWallets = new Map();
    this.mockTransactions = new Map();
    this.mockTokens = new Map();
    this.mockKYCStatus = new Map();
    this.mockContracts = new Map();
    
    // Initialize demo data
    this.initializeDemoData();
  }

  initializeDemoData() {
    // Demo wallets
    this.mockWallets.set('user1', {
      wallet_address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      balance: '1250.75',
      currency: 'MAS',
      created_at: new Date('2024-01-15'),
      status: 'active'
    });

    this.mockWallets.set('user2', {
      wallet_address: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063',
      balance: '890.25',
      currency: 'MAS',
      created_at: new Date('2024-02-10'),
      status: 'active'
    });

    // Demo transactions
    this.mockTransactions.set('tx1', {
      transaction_hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      from_wallet: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      to_wallet: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063',
      amount: '150.00',
      currency: 'MAS',
      status: 'completed',
      timestamp: new Date('2024-06-25'),
      type: 'project_payment',
      project_id: 'proj_001'
    });

    this.mockTransactions.set('tx2', {
      transaction_hash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a',
      from_wallet: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063',
      to_wallet: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      amount: '75.50',
      currency: 'SKILL',
      status: 'completed',
      timestamp: new Date('2024-06-26'),
      type: 'skill_token_transfer',
      skill_category: 'JavaScript'
    });

    // Demo tokens
    this.mockTokens.set('SKILL', {
      token_address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'FairLance Skill Token',
      symbol: 'SKILL',
      decimals: 18,
      total_supply: '1000000',
      created_at: new Date('2024-01-01')
    });

    // Demo KYC status
    this.mockKYCStatus.set('user1', {
      status: 'verified',
      verified_at: new Date('2024-01-20'),
      verification_level: 'full',
      documents_submitted: ['passport', 'proof_of_address']
    });

    this.mockKYCStatus.set('user2', {
      status: 'pending',
      submitted_at: new Date('2024-06-28'),
      verification_level: 'basic',
      documents_submitted: ['national_id']
    });

    // Demo smart contracts
    this.mockContracts.set('contract1', {
      contract_address: '0xabcdef1234567890abcdef1234567890abcdef12',
      project_id: 'proj_001',
      client_wallet: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      freelancer_wallet: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063',
      amount: '500.00',
      status: 'active',
      milestones: [
        { id: 1, description: 'Initial Design', amount: '150.00', status: 'completed', completed_at: new Date('2024-06-20') },
        { id: 2, description: 'Development Phase 1', amount: '200.00', status: 'in_progress' },
        { id: 3, description: 'Final Testing', amount: '150.00', status: 'pending' }
      ],
      created_at: new Date('2024-06-15')
    });
  }

  // Simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock Wallet Management
  async createWallet(userId, walletName) {
    await this.delay();
    
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const wallet = {
      wallet_address: walletAddress,
      balance: '0.00',
      currency: 'MAS',
      created_at: new Date(),
      status: 'active'
    };
    
    this.mockWallets.set(userId, wallet);
    
    return {
      success: true,
      data: {
        wallet_address: walletAddress,
        transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'pending'
      }
    };
  }

  async getWalletBalance(walletAddress) {
    await this.delay(200);
    
    // Find wallet by address
    for (const [userId, wallet] of this.mockWallets.entries()) {
      if (wallet.wallet_address === walletAddress) {
        return {
          success: true,
          data: {
            wallet_address: walletAddress,
            balance: wallet.balance,
            currency: wallet.currency,
            last_updated: new Date()
          }
        };
      }
    }
    
    throw new Error('Wallet not found');
  }

  async getWalletTransactions(walletAddress) {
    await this.delay(300);
    
    const transactions = [];
    for (const [txId, tx] of this.mockTransactions.entries()) {
      if (tx.from_wallet === walletAddress || tx.to_wallet === walletAddress) {
        transactions.push({ id: txId, ...tx });
      }
    }
    
    return {
      success: true,
      data: transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    };
  }

  // Mock Token Management
  async transferToken(fromWallet, toWallet, tokenAddress, amount) {
    await this.delay(800);
    
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const transaction = {
      transaction_hash: transactionHash,
      from_wallet: fromWallet,
      to_wallet: toWallet,
      token_contract_address: tokenAddress,
      amount: amount.toString(),
      status: 'pending',
      timestamp: new Date(),
      type: 'token_transfer'
    };
    
    this.mockTransactions.set(transactionHash, transaction);
    
    // Simulate completion after delay
    setTimeout(() => {
      transaction.status = 'completed';
    }, 2000);
    
    return {
      success: true,
      data: {
        transaction_hash: transactionHash,
        status: 'pending',
        estimated_completion: new Date(Date.now() + 30000) // 30 seconds
      }
    };
  }

  // Mock KYC Management
  async initiateKYC(userData) {
    await this.delay(400);
    
    this.mockKYCStatus.set(userData.userId, {
      status: 'pending',
      submitted_at: new Date(),
      verification_level: 'basic',
      documents_submitted: []
    });
    
    return {
      success: true,
      data: {
        kyc_id: `kyc_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        next_steps: ['Upload identity document', 'Complete video verification']
      }
    };
  }

  async getKYCStatus(userId) {
    await this.delay(200);
    
    const kycData = this.mockKYCStatus.get(userId) || {
      status: 'not_started',
      verification_level: 'none'
    };
    
    return {
      success: true,
      data: kycData
    };
  }

  // Mock Smart Contract Management
  async deployEscrowContract(projectData) {
    await this.delay(1000);
    
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const contract = {
      contract_address: contractAddress,
      project_id: projectData.projectId,
      client_wallet: projectData.clientWallet,
      freelancer_wallet: projectData.freelancerWallet,
      amount: projectData.amount.toString(),
      status: 'deploying',
      milestones: projectData.milestones || [],
      created_at: new Date()
    };
    
    this.mockContracts.set(contractAddress, contract);
    
    // Simulate deployment completion
    setTimeout(() => {
      contract.status = 'active';
    }, 3000);
    
    return {
      success: true,
      data: {
        contract_address: contractAddress,
        transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'deploying'
      }
    };
  }

  // Utility Methods
  getExplorerURL(txHash) {
    return `https://explorer-testnet.maschain.com/tx/${txHash}`;
  }

  async healthCheck() {
    await this.delay(100);
    return {
      status: 'connected',
      data: {
        service: 'Mock MasChain Service',
        version: '1.0.0',
        timestamp: new Date(),
        mock_data_loaded: true
      }
    };
  }

  // Demo-specific methods
  getAllDemoData() {
    return {
      wallets: Array.from(this.mockWallets.entries()),
      transactions: Array.from(this.mockTransactions.entries()),
      tokens: Array.from(this.mockTokens.entries()),
      kycStatus: Array.from(this.mockKYCStatus.entries()),
      contracts: Array.from(this.mockContracts.entries())
    };
  }
}

module.exports = new MockMasChainService();
