//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract ZoraPlatforms {
  event PlatformCreated(address creator, uint platformId, string name);
  event TokenAdded(uint tokenId, uint platformId, uint timestamp);
  event OwnerChanged(uint platformId, address newOwner);

  struct PlatformData {
    address owner;
    uint[] tokens;
    string name;
  }

  mapping(uint => PlatformData) private platformData;

  using Counters for Counters.Counter;
  Counters.Counter private _platformIds;

  constructor() {
  }

  modifier onlyOwner(uint _platformId) {
    require(platformData[_platformId].owner == msg.sender, "You are not the owner");
    _;
  }

  function newPlatform(string memory _platformName) public {
    _platformIds.increment();
    PlatformData memory data;
    data.owner = msg.sender;
    data.name = _platformName;
    platformData[_platformIds.current()] = data;
    emit PlatformCreated(msg.sender, _platformIds.current(), _platformName);
  }

  function changeOwner(uint _platformId, address _newOwner) onlyOwner(_platformId) public {
    PlatformData storage data = platformData[_platformId];
    data.owner = _newOwner;
    emit OwnerChanged(_platformId, _newOwner);
  }

  function addToken(uint _tokenId, uint _platformId) onlyOwner(_platformId) public {
    uint[] storage tokenIds = platformData[_platformId].tokens;
    tokenIds.push(_tokenId);
    emit TokenAdded(_tokenId, _platformId, block.timestamp);
  }

  function getTokens(uint _platformId) public view returns (uint[] memory) {
    return platformData[_platformId].tokens;
  }

  function getOwner(uint _platformId) public view returns (address) {
    return platformData[_platformId].owner;
  }
}
