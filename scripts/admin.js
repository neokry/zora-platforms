const hre = require("hardhat");

async function main() {
  const address = "0x9a7Be9e59bA99f3b329735e2c0Ad926B9B5D6c86";
  const Platform = await hre.ethers.getContractFactory("Platform");
  const platform = await Platform.attach(address);

  const tx = await platform.grantRole(
    hre.ethers.constants.HashZero,
    "0xbbB4946160d6609479D5a3904c1994888d14829a"
  );
  await tx.wait();

  const ownerRole = hre.ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("OWNER_ROLE")
  );

  const tx2 = await platform.grantRole(
    ownerRole,
    "0xbbB4946160d6609479D5a3904c1994888d14829a"
  );
  await tx2.wait();

  console.log("Admin granted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
