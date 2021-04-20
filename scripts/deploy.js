// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ZoraMediaAddress = "0x7C2668BD0D3c050703CEcC956C11Bd520c26f7d4";
  const Platform = await hre.ethers.getContractFactory("Platform");
  const platform = await Platform.deploy();

  await platform.deployed();

  console.log("Platform deployed to:", platform.address);

  const PlatformFactory = await hre.ethers.getContractFactory(
    "PlatformFactory"
  );
  const platformFactory = await PlatformFactory.deploy(
    platform.address,
    ZoraMediaAddress
  );

  await platformFactory.deployed();

  console.log("Platform factory deployed to:", platformFactory.address);

  //RINKEBY
  //0x95b425523A4936ef1C6438C911573A9a78Ca4337
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
