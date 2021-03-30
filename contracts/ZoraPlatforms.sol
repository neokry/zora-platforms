//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract ZoraPlatforms {
  event PlatformCreated(address creator, uint platformId);
  event TokenAdded(uint tokenId, uint platformId, uint timestamp);

  mapping(uint => address) public platformOwners;
  mapping(uint => uint[]) public platformTokens;

  using Counters for Counters.Counter;
  Counters.Counter private _platformIds;

  constructor() {
  }

  function newPlatform() public {
    _platformIds.increment();
    platformOwners[_platformIds.current()] = msg.sender;
  }

  function changeOwner(uint _platformId, address _newOwner) public {
    require(platformOwners[_platformId] == msg.sender);
    platformOwners[_platformId] = _newOwner;
  }

  function addToken(uint _tokenId, uint _platformId) public {
    require(platformOwners[_platformId] == msg.sender);
    uint[] storage tokenIds = platformTokens[_platformId];
    tokenIds.push(_tokenId);
  }

  function getTokens(uint _platformId) public view returns (uint[] memory) {
    return platformTokens[_platformId];
  }
}
