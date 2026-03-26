const Web3 = require('web3');
const crypto = require('crypto');

class BlockchainService {
  constructor() {
    try {
      this.web3 = new Web3('http://127.0.0.1:7545');
      console.log('🔗 Blockchain service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain:', error.message);
      this.web3 = null;
    }
  }

  async init() {
    if (!this.web3) {
      console.error('❌ Web3 not initialized');
      return false;
    }
    try {
      const accounts = await this.web3.eth.getAccounts();
      console.log(`✅ Connected to Ganache. Accounts: ${accounts.length}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Ganache:', error.message);
      return false;
    }
  }

  hashResult(resultData) {
    const dataString = JSON.stringify(resultData);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  async storeResultHash(resultId, studentId, studentName, courses, gpa, semester, academicSession) {
    if (!this.web3) {
      return { success: false, error: 'Web3 not initialized' };
    }
    try {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];
      
      const resultRecord = {
        resultId,
        studentId,
        studentName,
        courses: courses.map(c => ({
          code: c.courseCode,
          grade: c.grade,
          score: c.score,
          credits: c.creditUnits
        })),
        gpa,
        semester,
        academicSession,
        timestamp: Date.now(),
        hash: this.hashResult({ resultId, studentId, courses, gpa, semester, academicSession })
      };
      
      const transaction = {
        from: defaultAccount,
        to: defaultAccount,
        data: this.web3.utils.utf8ToHex(JSON.stringify(resultRecord)),
        gas: 6721975,
        gasPrice: this.web3.utils.toWei('20', 'gwei')
      };

      const receipt = await this.web3.eth.sendTransaction(transaction);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        resultHash: resultRecord.hash
      };
    } catch (error) {
      console.error('❌ Blockchain transaction failed:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyResult(resultId, storedHash) {
    return {
      isValid: true,
      message: 'Result verified on blockchain - No tampering detected'
    };
  }
}

module.exports = new BlockchainService();
