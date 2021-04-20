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

  it("Update base platform address", async function () {
    await this.platformFactory.updateBasePlatformAddress(
      "0xa471C9508Acf13867282f36cfCe5c41D719ab78B"
    );
    const address = await this.platformFactory.basePlatformAddress();
    expect(address).equals("0xa471C9508Acf13867282f36cfCe5c41D719ab78B");
  });
});
