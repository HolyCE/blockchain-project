const Web3 = require('web3');

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

async function verifyDeployment() {
    console.log('\n🔍 VERIFYING CONTRACT DEPLOYMENT\n');
    console.log('=========================================\n');
    
    // Check both possible addresses
    const addresses = [
        '0x20610b9f7A387b817C1017eabFf7D2E33f5D6B7E', // From .env
        '0xDb783Ad6efA64Cf10Fb5bA4e480E7a75C69307F9'  // From JSON
    ];
    
    for (const address of addresses) {
        console.log(`Checking address: ${address}`);
        
        // Check if address format is valid
        if (!web3.utils.isAddress(address)) {
            console.log('   ❌ Invalid address format\n');
            continue;
        }
        console.log('   ✅ Valid address format');
        
        // Check if contract exists at this address
        try {
            const code = await web3.eth.getCode(address);
            
            if (code !== '0x') {
                console.log('   ✅ Contract DEPLOYED!');
                console.log(`   Code size: ${code.length / 2} bytes`);
                
                // Get transaction count at this address
                const txCount = await web3.eth.getTransactionCount(address);
                console.log(`   Transaction count: ${txCount}`);
                
                // Check balance
                const balance = await web3.eth.getBalance(address);
                if (balance !== '0') {
                    console.log(`   Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
                }
                
                console.log('   ✅ Contract is ready for use!\n');
            } else {
                console.log('   ❌ No contract at this address\n');
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }
    
    // Also check if we can connect to Ganache
    console.log('📡 Ganache Connection Status:');
    const isListening = await web3.eth.net.isListening();
    if (isListening) {
        const blockNumber = await web3.eth.getBlockNumber();
        const accounts = await web3.eth.getAccounts();
        console.log(`   ✅ Connected to Ganache`);
        console.log(`   Block: ${blockNumber}`);
        console.log(`   Accounts: ${accounts.length}`);
        console.log(`   First account: ${accounts[0]}`);
    } else {
        console.log('   ❌ Cannot connect to Ganache');
    }
    
    console.log('\n=========================================\n');
}

verifyDeployment().catch(console.error);
