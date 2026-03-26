require('dotenv').config();
const mongoose = require('mongoose');
const Web3 = require('web3');
const fs = require('fs');

async function testCompleteSystem() {
    console.log('\n🚀 COMPLETE SYSTEM TEST\n');
    console.log('=========================================\n');
    
    let allPassed = true;
    
    // Test 1: Database Connection
    console.log('📊 TEST 1: MongoDB Connection');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log(`   Host: ${mongoose.connection.host}`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        allPassed = false;
    }
    console.log('');
    
    // Test 2: Blockchain Connection
    console.log('⛓️  TEST 2: Blockchain Connection');
    try {
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        const isListening = await web3.eth.net.isListening();
        const blockNumber = await web3.eth.getBlockNumber();
        const networkId = await web3.eth.net.getId();
        
        if (isListening) {
            console.log('✅ Ganache Connected');
            console.log(`   Network ID: ${networkId}`);
            console.log(`   Current Block: ${blockNumber}`);
        } else {
            console.log('❌ Ganache Not Connected');
            allPassed = false;
        }
    } catch (error) {
        console.error('❌ Blockchain Error:', error.message);
        allPassed = false;
    }
    console.log('');
    
    // Test 3: Smart Contract Verification
    console.log('📝 TEST 3: Smart Contract');
    try {
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
        
        if (web3.utils.isAddress(contractAddress)) {
            console.log('✅ Contract address format valid');
            const code = await web3.eth.getCode(contractAddress);
            
            if (code !== '0x') {
                console.log('✅ Contract deployed with code');
                console.log(`   Address: ${contractAddress}`);
                console.log(`   Code size: ${code.length / 2} bytes`);
            } else {
                console.log('❌ No contract found at address');
                allPassed = false;
            }
        } else {
            console.log('❌ Invalid contract address format');
            allPassed = false;
        }
    } catch (error) {
        console.error('❌ Contract Error:', error.message);
        allPassed = false;
    }
    console.log('');
    
    // Summary
    console.log('=========================================');
    if (allPassed) {
        console.log('🎉 ALL TESTS PASSED! System is ready!');
    } else {
        console.log('⚠️  SOME TESTS FAILED. Please check the errors above.');
    }
    console.log('=========================================\n');
}

testCompleteSystem().catch(console.error);
