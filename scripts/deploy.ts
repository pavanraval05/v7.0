import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const YourContract = await ethers.getContractFactory("BasicDutchAuction");
  const yourContract = await YourContract.deploy("1000000000", 100000000, 1);

  console.log("Contract address:", yourContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });