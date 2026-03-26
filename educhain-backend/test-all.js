require('dotenv').config();
const mongoose = require('mongoose');
const Web3 = require('web3');

async function testAll() {
    console.log('\n🚀 TESTING COMPLETE SYSTEM\n');
    console.log('=========================================\n');
    
    // Test 1: Database Connection
    console.log('📊 TEST 1: Database Connection');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
    }
    console.log('');
    
    // Test 2: Blockchain Connection
    console.log('⛓️  TEST 2: Blockchain Connection');
    try {
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        const isListening = await web3.eth.net.isListening();
        const blockNumber = await web3.eth.getBlockNumber();
        
        if (isListening) {
            console.log('✅ Ganache Connected');
            console.log(`   Current Block: ${blockNumber}`);
        } else {
            console.log('❌ Ganache Not Connected');
        }
    } catch (error) {
        console.error('❌ Blockchain Error:', error.message);
    }
    console.log('');
    
    // Test 3: Contract Verification
    console.log('📝 TEST 3: Smart Contract');
    try {
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        const code = await web3.eth.getCode(process.env.BLOCKCHAIN_CONTRACT_ADDRESS);
        
        if (code !== '0x') {
            console.log('✅ Contract Deployed');
            console.log(`   Address: ${process.env.BLOCKCHAIN_CONTRACT_ADDRESS}`);
        } else {
            console.log('❌ Contract Not Found');
        }
    } catch (error) {
        console.error('❌ Contract Error:', error.message);
    }
    console.log('');
    
    // Summary
    console.log('=========================================');
    console.log('🎉 SYSTEM TEST COMPLETE');
    console.log('=========================================\n');
}

testAll().catch(console.error);
