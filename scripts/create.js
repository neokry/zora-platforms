const hre = require("hardhat");

async function main() {
  const address = "0x2939415C4b26Fa26559e08555f09605bCc6099aE";
  const PlatformFactory = await hre.ethers.getContractFactory(
    "PlatformFactory"
  );
  const platformFactory = await PlatformFactory.attach(address);
  const tx = await platformFactory.createPlatform();
  await tx.wait();

  const platforms = await platformFactory.getPlatforms();
  console.log("Platforms", platforms);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
