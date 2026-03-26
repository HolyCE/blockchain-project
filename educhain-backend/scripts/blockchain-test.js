// scripts/blockchain-test.js
const blockchainService = require('../src/blockchain/config');

async function testBlockchain() {
  console.log('🔗 Testing Blockchain Integration');
  console.log('===============================');
  
  try {
    const connected = await blockchainService.init();
    if (!connected) {
      console.log('❌ Failed to connect to Ganache');
      console.log('Make sure Ganache is running: ganache-cli --port 7545 --networkId 5777');
      return;
    }
    
    const testData = {
      studentId: 'COM/22/1234',
      courseCode: 'CSC301',
      score: 85,
      grade: 'A',
      semester: 'First',
      academicSession: '2023/2024'
    };
    
    const hash = blockchainService.hashResult(testData);
    console.log('✅ Hash generated:', hash);
    console.log('✅ Hash length:', hash.length);
    
    const result = await blockchainService.storeResultHash(
      'test123', 'COM/22/1234', 'CSC301', 85, 'A', hash
    );
    
    if (result.success) {
      console.log('📦 Transaction result:');
      console.log('   Transaction Hash:', result.transactionHash);
      console.log('   Block Hash:', result.blockHash);
      console.log('   Block Number:', result.blockNumber);
      console.log('\n🎉 Blockchain integration test complete!');
    } else {
      console.log('❌ Transaction failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBlockchain().catch(console.error);
