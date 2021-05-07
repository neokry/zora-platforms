const hre = require("hardhat");

async function main() {
  const PLATFORM_FACTORY_ADDRESS = "0x2939415C4b26Fa26559e08555f09605bCc6099aE";
  const ADMIN_ADDRESSES = ["0xa471C9508Acf13867282f36cfCe5c41D719ab78B"];
  const OWNER_ADDRESSES = ["0x4f67B77f59b993BAFc0EF6EdDa4CD55d20E5F306"];
  const CREATOR_ADDRESSES = ["0x04bfb0034F24E424489F566f32D1f57647469f9E"];

  const PlatformFactory = await hre.ethers.getContractFactory(
    "PlatformFactory"
  );

  const platformFactory = await PlatformFactory.attach(
    PLATFORM_FACTORY_ADDRESS
  );

  const tx = await platformFactory.createPlatformWithRoles(
    ADMIN_ADDRESSES,
    OWNER_ADDRESSES,
    CREATOR_ADDRESSES
  );

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
