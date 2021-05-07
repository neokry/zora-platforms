const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlatformFactory", function () {
  before(async function () {
    this.Platform = await ethers.getContractFactory("Platform");
    this.PlatformFactory = await ethers.getContractFactory("PlatformFactory");
  });

  beforeEach(async function () {
    this.platform = await this.Platform.deploy();
    await this.platform.deployed();

    const ZoraMediaAddress = "0xED4C8F9c21c21C787Fec612d73C9683ceF891560";

    this.platformFactory = await this.PlatformFactory.deploy(
      this.platform.address,
      ZoraMediaAddress
    );

    await this.platformFactory.deployed();
  });

  it("Should create a platform", async function () {
    await this.platformFactory.createPlatform();
    const platforms = await this.platformFactory.platforms(0);
    expect(platforms).is.not.null;
  });

  it("Should create a platform with roles", async function () {
    const admins = ["0xa471C9508Acf13867282f36cfCe5c41D719ab78B"];
    const owners = ["0x4f67B77f59b993BAFc0EF6EdDa4CD55d20E5F306"];
    const creators = ["0x04bfb0034F24E424489F566f32D1f57647469f9E"];

    await this.platformFactory.createPlatformWithRoles(
      admins,
      owners,
      creators
    );

    const platformAddress = await this.platformFactory.platforms(0);
    const platform = await this.Platform.attach(platformAddress);

    const adminRole = ethers.constants.HashZero;
    const ownerRole = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("OWNER_ROLE")
    );
    const creatorRole = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("CREATOR_ROLE")
    );

    const hasAdmin = await platform.hasRole(
      adminRole,
      "0xa471C9508Acf13867282f36cfCe5c41D719ab78B"
    );
    const hasOwner = await platform.hasRole(
      ownerRole,
      "0x4f67B77f59b993BAFc0EF6EdDa4CD55d20E5F306"
    );
    const hasCreator = await platform.hasRole(
      creatorRole,
      "0x04bfb0034F24E424489F566f32D1f57647469f9E"
    );

    expect(platformAddress).is.not.null;
    expect(hasAdmin).is.true;
    expect(hasOwner).is.true;
    expect(hasCreator).is.true;
  });

  it("Should create a platform with empty roles", async function () {
    const admins = ["0xa471C9508Acf13867282f36cfCe5c41D719ab78B"];

    await this.platformFactory.createPlatformWithRoles(admins, [], []);

    const platformAddress = await this.platformFactory.platforms(0);
    const platform = await this.Platform.attach(platformAddress);

    const adminRole = ethers.constants.HashZero;

    const hasAdmin = await platform.hasRole(
      adminRole,
      "0xa471C9508Acf13867282f36cfCe5c41D719ab78B"
    );

    expect(platformAddress).is.not.null;
    expect(hasAdmin).is.true;
  });

  it("Should update the base platform address", async function () {
    await this.platformFactory.updateBasePlatformAddress(
      "0xa471C9508Acf13867282f36cfCe5c41D719ab78B"
    );
    const address = await this.platformFactory.basePlatformAddress();
    expect(address).equals("0xa471C9508Acf13867282f36cfCe5c41D719ab78B");
  });
});
