require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

async function testBlockchain() {
    console.log('\n🔗 FINAL BLOCKCHAIN CONNECTION TEST\n');
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
        // 2. Connect to Ganache
        console.log('🔌 Connecting to Ganache...');
        const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        
        // 3. Test connection
        const isListening = await web3.eth.net.isListening();
        const networkId = await web3.eth.net.getId();
        const blockNumber = await web3.eth.getBlockNumber();
        
        if (isListening) {
            console.log('✅ Connected to Ganache!');
            console.log(`   Network ID: ${networkId}`);
            console.log(`   Current Block: ${blockNumber}`);
        } else {
            console.log('❌ Not connected to Ganache');
            return;
        }
        console.log('');
        
        // 4. Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log(`👥 Accounts: ${accounts.length} accounts found`);
        console.log(`   First Account: ${accounts[0]}`);
        
        // 5. Check balance
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log(`💰 Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
        console.log('');
        
        // 6. Verify contract address format
        const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
        console.log('📝 Verifying contract...');
        
        if (!web3.utils.isAddress(contractAddress)) {
            console.error('❌ Invalid contract address format!');
            return;
        }
        console.log('✅ Contract address format is valid');
        
        // 7. Check if contract exists
        const code = await web3.eth.getCode(contractAddress);
        
        if (code !== '0x') {
            console.log('✅ Contract is deployed and has code!');
            console.log(`   Code size: ${code.length / 2} bytes`);
            console.log(`   Contract Address: ${contractAddress}`);
            
            // 8. Try to interact with contract if ABI is available
            if (process.env.CONTRACT_ABI_PATH && fs.existsSync(process.env.CONTRACT_ABI_PATH)) {
                console.log('\n📄 Loading contract ABI...');
                const contractData = JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, 'utf8'));
                const contract = new web3.eth.Contract(contractData.abi, contractAddress);
                console.log('✅ Contract ABI loaded successfully');
                console.log('   Ready to interact with smart contract!');
            } else {
                console.log('\n⚠️  Contract ABI file not found, but contract exists');
            }
        } else {
            console.log('❌ No contract found at this address!');
            console.log('   Make sure the contract was deployed to Ganache');
        }
        
        console.log('\n=========================================');
        console.log('🎉 BLOCKCHAIN CONNECTION SUCCESSFUL!');
        console.log('=========================================\n');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure Ganache is running');
        console.log('   2. Check if contract is deployed');
        console.log('   3. Verify contract address in .env');
    }
}

testBlockchain();
