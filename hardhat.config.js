require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true // Enable intermediate representation for better optimization
    }
  },
  networks: {
    hardhat: {
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
      accounts: {
        count: 10, // More accounts for testing
        accountsBalance: "10000000000000000000000" // 10,000 ETH per account
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      gas: 12000000,
      blockGasLimit: 12000000
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD'
  },
  mocha: {
    timeout: 40000
  }
};