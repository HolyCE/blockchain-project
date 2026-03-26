const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

async function deploy() {
    try {
        console.log('\n🚀 Deploying ResultStorage Contract to Ganache\n');
        console.log('=========================================\n');
        
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0];
        
        console.log(`📡 Deployer Address: ${deployer}`);
        const balance = await web3.eth.getBalance(deployer);
        console.log(`💰 Deployer Balance: ${web3.utils.fromWei(balance, 'ether')} ETH\n`);
        
        // Load compiled contract
        const contractPath = './build/contracts/ResultStorage.json';
        
        if (!fs.existsSync(contractPath)) {
            console.error('❌ Contract not compiled! Run: truffle compile');
            return;
        }
        
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        console.log('📄 Contract loaded: ResultStorage');
        console.log(`   Bytecode size: ${contractData.bytecode.length} bytes`);
        console.log(`   ABI methods: ${contractData.abi.filter(m => m.type === 'function').length}\n`);
        
        // Create contract instance
        const contract = new web3.eth.Contract(contractData.abi);
        
        console.log('⏳ Deploying contract...');
        
        // Prepare deployment
        const deployTx = contract.deploy({
            data: contractData.bytecode,
            arguments: [] // No constructor arguments needed
        });
        
        // Estimate gas
        const gasEstimate = await deployTx.estimateGas();
        console.log(`📊 Estimated gas: ${gasEstimate}`);
        
        const gasPrice = await web3.eth.getGasPrice();
        console.log(`💰 Gas price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
        
        // Deploy
        const deployedContract = await deployTx.send({
            from: deployer,
            gas: gasEstimate,
            gasPrice: gasPrice
        });
        
        const contractAddress = deployedContract.options.address;
        
        console.log('\n✅ CONTRACT DEPLOYED SUCCESSFULLY!');
        console.log('=========================================');
        console.log(`📝 Contract Address: ${contractAddress}`);
        console.log(`🔗 Transaction Hash: ${deployedContract.transactionHash}`);
        console.log(`📦 Block Number: ${deployedContract.blockNumber}`);
        console.log('=========================================\n');
        
        // Update the JSON file with the address
        contractData.address = contractAddress;
        fs.writeFileSync(contractPath, JSON.stringify(contractData, null, 2));
        console.log('✅ Updated ResultStorage.json with contract address');
        
        // Save address to a separate file
        fs.writeFileSync('contract-address.txt', contractAddress);
        console.log('✅ Saved address to contract-address.txt');
        
        // Update .env file
        let envContent = '';
        if (fs.existsSync('.env')) {
            envContent = fs.readFileSync('.env', 'utf8');
        }
        
        // Remove old BLOCKCHAIN_CONTRACT_ADDRESS if exists
        const lines = envContent.split('\n');
        const newLines = [];
        let updated = false;
        
        for (const line of lines) {
            if (line.startsWith('BLOCKCHAIN_CONTRACT_ADDRESS=')) {
                newLines.push(`BLOCKCHAIN_CONTRACT_ADDRESS=${contractAddress}`);
                updated = true;
            } else {
                newLines.push(line);
            }
        }
        
        if (!updated) {
            newLines.push(`BLOCKCHAIN_CONTRACT_ADDRESS=${contractAddress}`);
        }
        
        fs.writeFileSync('.env', newLines.join('\n'));
        console.log('✅ Updated .env with contract address\n');
        
        console.log('🎉 Deployment complete! You can now see the contract in Ganache.');
        console.log('   Go to Ganache GUI → CONTRACTS tab to verify.\n');
        
        return contractAddress;
        
    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        
        if (error.message.includes('Couldn\'t connect')) {
            console.log('\n💡 Make sure Ganache is running:');
            console.log('   - Open Ganache GUI');
            console.log('   - Click "Quickstart"');
            console.log('   - Wait for it to start on http://127.0.0.1:7545\n');
        }
    }
}

deploy();
