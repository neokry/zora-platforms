const { getAddress } = require("@ethersproject/address");
const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Platforms", function () {
  it("Should set platform id", async function () {
    const Platform = await ethers.getContractFactory("ZoraPlatforms");
    const platform = await Platform.deploy();

    await platform.deployed();

    await platform.newPlatform("dev");
    const accounts = await ethers.getSigners();
    const address = accounts[0].address;
    expect(await platform.getOwner(1)).to.equal(address);
  });

  it("Should change owner", async function () {
    const Platform = await ethers.getContractFactory("ZoraPlatforms");
    const platform = await Platform.deploy();

    await platform.deployed();

    await platform.newPlatform("dev");
    const accounts = await ethers.getSigners();
    const newOwner = accounts[1].address;

    await platform.changeOwner(1, newOwner);
    expect(await platform.getOwner(1)).to.equal(newOwner);
  });

  it("Should add tokens", async function () {
    const Platform = await ethers.getContractFactory("ZoraPlatforms");
    const platform = await Platform.deploy();

    await platform.deployed();

    await platform.newPlatform("dev");
    const platformId = 1;

    await platform.addToken(1234, platformId);
    const tokens = await platform.getTokens(platformId);
    expect(tokens[0]).to.equal(BigNumber.from(1234));
  });
});
