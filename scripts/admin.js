const hre = require("hardhat");

async function main() {
  const address = "0xC06Bc66c4BD7660c255eED07F76681A6312B6F61";
  const Platform = await hre.ethers.getContractFactory("Platform");
  const platform = await Platform.attach(address);

  const tx = await platform.grantRole(
    hre.ethers.constants.HashZero,
    "0x8440cE7672C0e614E40C2c7f7CB70D711fEDAE56"
  );
  await tx.wait();

  const ownerRole = hre.ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("OWNER_ROLE")
  );

  const tx2 = await platform.grantRole(
    ownerRole,
    "0x8440cE7672C0e614E40C2c7f7CB70D711fEDAE56"
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
