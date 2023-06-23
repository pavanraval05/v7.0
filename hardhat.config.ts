import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import "@nomiclabs/hardhat-ethers";

import './tasks/deploy';

dotenv.config();

module.exports = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/ff2ee68a760748dbb00ebfc0b112f787`,
      accounts: ["47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"],
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

