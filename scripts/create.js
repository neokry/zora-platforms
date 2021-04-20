const hre = require("hardhat");

async function main() {
  const address = "0xaF6df96cEC9f8237D120a949156d82b8c5e66a74";
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
