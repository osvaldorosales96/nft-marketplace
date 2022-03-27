const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function(){
  let deployer, addr1, addr2, nft, marketplace
  let feePercent = 1
  beforeEach(async function() {
    // Get contract factories
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    // Get signers
    [deployer, addr1, addr2] = await ethers.getSigners()
    // Deploy contracts
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy( feePercent );
  });  
  describe("Deployment", function () {
    it("Should track name and symbol of the nft collection", async function () {
      expect(await nft.name()).to.equal("DApp NFT");
      expect(await nft.symbol()).to.equal("DAPP");
    });
  });
})
