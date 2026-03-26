require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

async function testBlockchain() {
    console.log('\n🔗 TESTING BLOCKCHAIN CONNECTION\n');
    console.log('=========================================\n');
    
    // 1. Check environment variables
    console.log('📋 Environment Variables:');
    console.log(`   RPC URL: ${process.env.BLOCKCHAIN_RPC_URL || 'NOT SET'}`);
    console.log(`   Contract Address: ${process.env.BLOCKCHAIN_CONTRACT_ADDRESS || 'NOT SET'}`);
    console.log(`   Network: ${process.env.BLOCKCHAIN_NETWORK || 'NOT SET'}`);
    console.log(`   Private Key: ${process.env.BLOCKCHAIN_PRIVATE_KEY ? '✓ SET' : '✗ NOT SET'}`);
    console.log('');
    
    if (!process.env.BLOCKCHAIN_RPC_URL || !process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
        console.error('❌ Missing blockchain configuration in .env file');
        return;
    }
    
    try {
        // 2. Connect to blockchain
        console.log('🔌 Connecting to blockchain...');
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        
        // 3. Test connection
        const isListening = await web3.eth.net.isListening();
        const networkId = await web3.eth.net.getId();
        const blockNumber = await web3.eth.getBlockNumber();
        
        console.log('✅ Connected successfully!');
        console.log(`   Network ID: ${networkId}`);
        console.log(`   Current Block: ${blockNumber}`);
        console.log(`   Listening: ${isListening}`);
        console.log('');
        
        // 4. Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log(`👥 Accounts found: ${accounts.length}`);
        console.log(`   First Account: ${accounts[0]}`);
        
        // 5. Check balance
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log(`💰 Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
        console.log('');
        
        // 6. Verify contract
        console.log('📝 Verifying contract deployment...');
        const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
        const code = await web3.eth.getCode(contractAddress);
        
        if (code !== '0x') {
            console.log('✅ Contract is deployed!');
            console.log(`   Address: ${contractAddress}`);
            console.log(`   Code size: ${code.length / 2} bytes`);
            
            // 7. Try to load ABI if available
            if (process.env.CONTRACT_ABI_PATH && fs.existsSync(process.env.CONTRACT_ABI_PATH)) {
                const contractData = JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, 'utf8'));
                const contract = new web3.eth.Contract(contractData.abi, contractAddress);
                console.log('✅ Contract ABI loaded successfully');
            }
        } else {
            console.log('❌ No contract found at this address!');
            console.log('   Make sure you deployed the contract correctly');
        }
        
        console.log('\n=========================================');
        console.log('🎉 Blockchain is ready for use!');
        console.log('=========================================\n');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure Ganache is running: http://127.0.0.1:7545');
        console.log('   2. Check if the contract was deployed successfully');
        console.log('   3. Verify the contract address in .env file');
        console.log('   4. Run: ganache --port 7545 (if using CLI)');
    }
}

testBlockchain();
