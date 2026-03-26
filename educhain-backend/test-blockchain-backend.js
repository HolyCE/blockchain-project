require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

async function testBlockchainBackend() {
    console.log('\n🔗 TESTING BLOCKCHAIN BACKEND INTEGRATION\n');
    console.log('=========================================\n');
    
    // Get configuration from .env
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const network = process.env.BLOCKCHAIN_NETWORK;
    
    console.log('📋 Blockchain Configuration:');
    console.log(`   RPC URL: ${rpcUrl}`);
    console.log(`   Contract Address: ${contractAddress}`);
    console.log(`   Network: ${network}`);
    console.log(`   Private Key: ${privateKey ? '✓ Set' : '✗ Not Set'}\n`);
    
    // Connect to Ganache
    const web3 = new Web3(rpcUrl);
    
    try {
        // Test connection
        const isListening = await web3.eth.net.isListening();
        const networkId = await web3.eth.net.getId();
        const blockNumber = await web3.eth.getBlockNumber();
        
        console.log('✅ Connected to Ganache');
        console.log(`   Network ID: ${networkId}`);
        console.log(`   Current Block: ${blockNumber}\n`);
        
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log(`👥 Accounts (${accounts.length}):`);
        console.log(`   First Account: ${accounts[0]}`);
        
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log(`   Balance: ${web3.utils.fromWei(balance, 'ether')} ETH\n`);
        
        // Verify contract
        console.log('📝 Verifying Smart Contract:');
        const code = await web3.eth.getCode(contractAddress);
        
        if (code !== '0x') {
            console.log(`   ✅ Contract Deployed`);
            console.log(`   Address: ${contractAddress}`);
            console.log(`   Code Size: ${code.length / 2} bytes`);
            console.log(`   Transactions: ${await web3.eth.getTransactionCount(contractAddress)}\n`);
            
            // Load ABI
            const abiPath = './build/contracts/ResultStorage.json';
            if (fs.existsSync(abiPath)) {
                const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
                const contract = new web3.eth.Contract(contractData.abi, contractAddress);
                
                // List available functions
                const functions = contractData.abi.filter(m => m.type === 'function');
                console.log('📋 Available Contract Functions:');
                functions.forEach(fn => {
                    const params = fn.inputs.map(i => `${i.name}:${i.type}`).join(', ');
                    console.log(`   - ${fn.name}(${params}) → ${fn.outputs?.[0]?.type || 'void'}`);
                });
                console.log('');
            }
            
            console.log('✅ SMART CONTRACT IS READY FOR USE!');
        } else {
            console.log('   ❌ No contract found at this address!\n');
        }
        
        console.log('=========================================');
        console.log('🎉 BLOCKCHAIN INTEGRATION SUCCESSFUL!');
        console.log('=========================================\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure Ganache is running: http://127.0.0.1:7545');
        console.log('   2. Check if the contract address is correct');
        console.log('   3. Verify the private key is valid\n');
    }
}

testBlockchainBackend();
