let Web3;
try {
  Web3 = require('web3');
} catch (error) {
  console.warn('⚠️ Web3 not installed, blockchain features will be disabled');
  Web3 = null;
}

class BlockchainConfig {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.initialized = false;
  }

  async initialize() {
    if (!Web3) {
      console.warn('⚠️ Web3 library not available, blockchain features disabled');
      this.initialized = false;
      return false;
    }

    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:7545';
      
      // For local Ganache, use HTTP provider
      if (rpcUrl.includes('127.0.0.1') || rpcUrl.includes('localhost')) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      } else {
        this.web3 = new Web3(rpcUrl);
      }
      
      // Test connection (don't fail if not connected)
      try {
        const isListening = await this.web3.eth.net.isListening();
        if (isListening) {
          console.log('✅ Blockchain connected:', rpcUrl);
          this.initialized = true;
        } else {
          console.warn('⚠️ Blockchain not responding, but continuing without it');
          this.initialized = false;
        }
      } catch (err) {
        console.warn('⚠️ Cannot connect to blockchain:', err.message);
        this.initialized = false;
      }
      
      // Load contract if address exists
      if (process.env.BLOCKCHAIN_CONTRACT_ADDRESS && this.web3) {
        console.log('📝 Contract address configured:', process.env.BLOCKCHAIN_CONTRACT_ADDRESS);
      }
      
      return this.initialized;
    } catch (error) {
      console.warn('⚠️ Blockchain initialization failed:', error.message);
      this.initialized = false;
      return false;
    }
  }

  getWeb3() {
    return this.web3;
  }

  getContract() {
    return this.contract;
  }

  isInitialized() {
    return this.initialized;
  }
}

// Export a singleton instance
const blockchainConfig = new BlockchainConfig();

// Initialize immediately but don't block startup
blockchainConfig.initialize().catch(console.error);

module.exports = blockchainConfig;
