const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

describe("Platform", function () {
  before(async function () {
    this.Platform = await ethers.getContractFactory("Platform");
    this.MockMedia = await ethers.getContractFactory("MockMedia");
  });

  beforeEach(async function () {
    this.platform = await this.Platform.deploy();
    await this.platform.deployed();

    this.mockMedia = await this.MockMedia.deploy();
    await this.mockMedia.deployed();
  });

  it("Should mint artwork", async function () {
    const media = {
      tokenURI: "test",
      metadataURI: "test",
      contentHash: ethers.utils.formatBytes32String("test"),
      metadataHash: ethers.utils.formatBytes32String("test"),
    };

    const bidShares = {
      prevOwner: { value: 2 },
      creator: { value: 2 },
      owner: { value: 2 },
    };

    const sig = {
      deadline: BigNumber.from("2"),
      v: ethers.utils.randomBytes(1)[0],
      r: ethers.utils.formatBytes32String("test"),
      s: ethers.utils.formatBytes32String("test"),
    };

    const accounts = await ethers.getSigners();
    await this.platform.init(accounts[0].address, this.mockMedia.address);
    await this.platform.mintWithSig(media, bidShares, sig);
    const hashes = await this.platform.getAllContentHashes();

    expect(hashes.length).is.greaterThan(0);
    expect(hashes).contains(ethers.utils.formatBytes32String("test"));
  });

  it("Should get role members", async function () {
    const accounts = await ethers.getSigners();
    await this.platform.init(accounts[0].address, this.mockMedia.address);

    const ownerRole = await this.platform.OWNER_ROLE();
    await this.platform.grantRole(ownerRole, accounts[1].address);

    const owners = await this.platform.getRoleMembers(ownerRole);

    expect(owners.length).is.greaterThan(1);
    expect(owners).contains(accounts[0].address);
    expect(owners).contains(accounts[1].address);
  });

  it("Should batch set role", async function () {
    const accounts = await ethers.getSigners();
    await this.platform.init(accounts[0].address, this.mockMedia.address);

    const ownerRole = await this.platform.OWNER_ROLE();
    const accountAddresses = accounts.map((x) => x.address);
    await this.platform.batchSetRole(ownerRole, accountAddresses);

    const owners = await this.platform.getRoleMembers(ownerRole);

    expect(owners.length).is.greaterThan(1);
    expect(owners).contains(accountAddresses[0]);
    expect(owners).contains(accountAddresses[accountAddresses.length - 1]);
  });
});
