require('dotenv').config();
const mongoose = require('mongoose');
const Web3 = require('web3');

async function finalSystemTest() {
    console.log('\n🚀 FINAL SYSTEM READINESS TEST\n');
    console.log('=========================================\n');
    
    let allPassed = true;
    
    // Test 1: Database
    console.log('📊 1. MongoDB Atlas:');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('   ✅ Connected successfully');
        await mongoose.disconnect();
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        allPassed = false;
    }
    
    // Test 2: Blockchain
    console.log('\n⛓️  2. Blockchain (Ganache):');
    try {
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        const isListening = await web3.eth.net.isListening();
        if (isListening) {
            const blockNumber = await web3.eth.getBlockNumber();
            console.log(`   ✅ Connected (Block: ${blockNumber})`);
        } else {
            console.log('   ❌ Not connected');
            allPassed = false;
        }
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        allPassed = false;
    }
    
    // Test 3: Smart Contract
    console.log('\n📝 3. Smart Contract:');
    try {
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        const address = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
        const code = await web3.eth.getCode(address);
        
        if (code !== '0x') {
            console.log(`   ✅ Contract deployed at: ${address}`);
            console.log(`   📦 Code size: ${code.length / 2} bytes`);
        } else {
            console.log('   ❌ Contract not found');
            allPassed = false;
        }
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        allPassed = false;
    }
    
    // Summary
    console.log('\n=========================================');
    if (allPassed) {
        console.log('🎉 ALL SYSTEMS READY FOR DEPLOYMENT!');
        console.log('=========================================\n');
        console.log('Your blockchain configuration:');
        console.log(`   RPC URL: ${process.env.BLOCKCHAIN_RPC_URL}`);
        console.log(`   Contract: ${process.env.BLOCKCHAIN_CONTRACT_ADDRESS}`);
        console.log(`   Network: ${process.env.BLOCKCHAIN_NETWORK}\n`);
        console.log('Next Steps:');
        console.log('   1. Push code to GitHub');
        console.log('   2. Deploy backend to Render');
        console.log('   3. Deploy frontend to Netlify');
        console.log('   4. Configure environment variables on hosting platforms\n');
    } else {
        console.log('⚠️  SOME TESTS FAILED. Please fix before deployment.\n');
    }
}

finalSystemTest().catch(console.error);
