// scripts/deploy.js
const { ethers } = require("hardhat");


async function main() {
    const [deployer, assessor1, assessor2, user1, user2] = await ethers.getSigners();
    
    console.log("=".repeat(50));
    console.log("DEPLOYING DECENTRALIZED INSURANCE CONTRACT");
    console.log("=".repeat(50));
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    
    // Deploy the contract
    console.log("\n📦 Deploying DecentralizedInsurance contract...");
    const InsuranceFactory = await ethers.getContractFactory("DecentralizedInsurance");
    
    const insuranceContract = await InsuranceFactory.deploy({
        gasLimit: 3000000 // Explicit gas limit for deployment
    });
    
    // Wait until mined (for Hardhat Ethers v6)
    await insuranceContract.waitForDeployment();
    
    const address = await insuranceContract.getAddress();
    console.log("✅ Insurance contract deployed at:", address);
    
    // Post-deployment setup
    console.log("\n⚙️  Setting up roles and initial configuration...");
    
    try {
        // Add additional assessors (deployer is already an assessor from constructor)
        if (assessor1) {
            console.log("Adding assessor role to:", assessor1.address);
            const tx1 = await insuranceContract.addAssessor(assessor1.address, {
                gasLimit: 100000
            });
            await tx1.wait();
            console.log("✅ Assessor 1 role granted");
        }
        
        if (assessor2) {
            console.log("Adding assessor role to:", assessor2.address);
            const tx2 = await insuranceContract.addAssessor(assessor2.address, {
                gasLimit: 100000
            });
            await tx2.wait();
            console.log("✅ Assessor 2 role granted");
        }
        
        // Set minimum assessor votes (optional - default is 2)
        console.log("Setting minimum assessor votes to 2...");
        const tx3 = await insuranceContract.setMinAssessorVotes(2, {
            gasLimit: 100000
        });
        await tx3.wait();
        console.log("✅ Minimum assessor votes set");
        
        // Create a sample insurance pool for testing
        console.log("\n🏊 Creating sample insurance pool...");
        const poolTx = await insuranceContract.createPool(
            "Health Insurance Pool",
            ethers.parseEther("0.1"), // 0.1 ETH minimum contribution
            ethers.parseEther("5.0"),  // 5 ETH coverage limit
            { gasLimit: 200000 }
        );
        await poolTx.wait();
        console.log("✅ Sample pool created - Pool ID: 0");
        
        // Display pool details
        const poolDetails = await insuranceContract.getPoolDetails(0);
        console.log("Pool Details:");
        console.log("  Name:", poolDetails[0]);
        console.log("  Minimum Contribution:", ethers.formatEther(poolDetails[2]), "ETH");
        console.log("  Coverage Limit:", ethers.formatEther(poolDetails[3]), "ETH");
        
    } catch (error) {
        console.error("❌ Error during post-deployment setup:", error.message);
    }
    
    // Verify contract state
    console.log("\n🔍 Verifying contract state...");
    try {
        const poolCount = await insuranceContract.poolCount();
        const claimCount = await insuranceContract.claimCount();
        const minVotes = await insuranceContract.minAssessorVotes();
        
        console.log("Contract State:");
        console.log("  Pool Count:", poolCount.toString());
        console.log("  Claim Count:", claimCount.toString());
        console.log("  Min Assessor Votes:", minVotes.toString());
        
        // Check roles
        const ADMIN_ROLE = await insuranceContract.ADMIN_ROLE();
        const CLAIM_ASSESSOR_ROLE = await insuranceContract.CLAIM_ASSESSOR_ROLE();
        
        console.log("\nRole Verification:");
        console.log("  Deployer has admin role:", await insuranceContract.hasRole(ADMIN_ROLE, deployer.address));
        console.log("  Deployer has assessor role:", await insuranceContract.hasRole(CLAIM_ASSESSOR_ROLE, deployer.address));
        
        if (assessor1) {
            console.log("  Assessor1 has assessor role:", await insuranceContract.hasRole(CLAIM_ASSESSOR_ROLE, assessor1.address));
        }
        if (assessor2) {
            console.log("  Assessor2 has assessor role:", await insuranceContract.hasRole(CLAIM_ASSESSOR_ROLE, assessor2.address));
        }
        
    } catch (error) {
        console.error("❌ Error during state verification:", error.message);
    }
    
    // Optional: Add some test members to the pool
    console.log("\n👥 Adding test members to the pool (optional)...");
    try {
        if (user1) {
            console.log("Adding user1 to pool...");
            const joinTx1 = await insuranceContract.connect(user1).joinPool(0, {
                value: ethers.parseEther("0.15"), // 0.15 ETH contribution
                gasLimit: 150000
            });
            await joinTx1.wait();
            console.log("✅ User1 joined pool with 0.15 ETH");
        }
        
        if (user2) {
            console.log("Adding user2 to pool...");
            const joinTx2 = await insuranceContract.connect(user2).joinPool(0, {
                value: ethers.parseEther("0.2"), // 0.2 ETH contribution
                gasLimit: 150000
            });
            await joinTx2.wait();
            console.log("✅ User2 joined pool with 0.2 ETH");
        }
        
        // Display updated pool details
        const updatedPoolDetails = await insuranceContract.getPoolDetails(0);
        console.log("\nUpdated Pool Details:");
        console.log("  Total Funds:", ethers.formatEther(updatedPoolDetails[1]), "ETH");
        console.log("  Member Count:", updatedPoolDetails[4].toString());
        
    } catch (error) {
        console.log("⚠️  Test member addition skipped:", error.message);
    }
    
    // Save deployment info
    console.log("\n💾 Saving deployment information...");
    const fs = require('fs');
    const deploymentInfo = {
        contractAddress: address,
        deployerAddress: deployer.address,
        network: await ethers.provider.getNetwork(),
        deploymentTime: new Date().toISOString(),
        roles: {
            admin: deployer.address,
            assessors: [
                deployer.address,
                assessor1?.address,
                assessor2?.address
            ].filter(Boolean)
        },
        samplePoolId: 0,
        abi: InsuranceFactory.interface.format('json')
    };
    
    try {
        if (!fs.existsSync('./deployments')) {
            fs.mkdirSync('./deployments');
        }
        fs.writeFileSync(
            './deployments/deployment-info.json', 
            JSON.stringify(deploymentInfo, null, 2)
        );
        console.log("✅ Deployment info saved to ./deployments/deployment-info.json");
    } catch (error) {
        console.log("⚠️  Could not save deployment info:", error.message);
    }
    
    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("Contract Address:", address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Gas Used: Check transaction receipts above");
    console.log("\n📋 Next Steps:");
    console.log("1. Update your frontend with the new contract address");
    console.log("2. Test claim submission and assessment functions");
    console.log("3. Verify all roles are properly assigned");
    console.log("4. Test with the sample pool (ID: 0)");
    
    console.log("\n🔧 Useful Commands:");
    console.log("- Check contract on Etherscan (if mainnet/testnet)");
    console.log("- npx hardhat verify --network <network> " + address);
    console.log("- Use the saved ABI in ./deployments/deployment-info.json");
    
    return {
        contractAddress: address,
        contract: insuranceContract,
        deployer: deployer.address
    };
}


// Execute deployment
main()
    .then((result) => {
        console.log("\n✅ Deployment script completed successfully");
        process.exitCode = 0;
    })
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exitCode = 1;
    });