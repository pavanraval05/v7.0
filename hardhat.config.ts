

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import "@nomiclabs/hardhat-ethers";

import './tasks/deploy';


module.exports = {
  networks: {
    georli: {
      chainId: 5,
      url: `https://eth-goerli.g.alchemy.com/v2/9_PhjVbypJLw-b4fr6P6B_27wVcPprxj`,
      accounts: ["0xe214a0730c100f63dcd4457045a2ccd5a092fcc365ca7049e92388a5e571b666"],
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

