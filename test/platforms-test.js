const { getAddress } = require("@ethersproject/address");
const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Platforms", function () {
  it("Should set platform id", async function () {
    const Platform = await ethers.getContractFactory("ZoraPlatforms");
    const platform = await Platform.deploy();

    await platform.deployed();

    await platform.newPlatform();
    const accounts = await ethers.getSigners();
    const address = accounts[0].address;
    expect(await platform.platformOwners(1)).to.equal(address);
  });

  it("Should add tokens", async function () {
    const Platform = await ethers.getContractFactory("ZoraPlatforms");
    const platform = await Platform.deploy();

    await platform.deployed();

    await platform.newPlatform();
    const platformId = 1;

    await platform.addToken(1234, platformId);
    const tokens = await platform.getTokens(platformId);
    expect(tokens[0]).to.equal(BigNumber.from(1234));
  });
});
