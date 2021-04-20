//SPDX-License-Identifier: Unlicense
pragma solidity 0.6.8;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPlatform.sol";

/**
 * @title A factory that generates platform implementations
 * @notice This contract provides an interface to generate zora sub-platforms 
 */
contract PlatformFactory is Ownable {

  event PlatformCreated(address creator, address instance);

  /* *******
  * Globals
  * *******
  */

  //Address of the zora media contract
  address immutable zoraMediaAddress;

  //Default platform implementation address for cloning
  address public basePlatformAddress;

  //List of patforms that have been created through the protocol
  address[] public platforms;

  /**
  * @notice On deployment, set the media contract and platform contract addresses
  */
  constructor(address _basePlatformAddress, address _zoraMediaAddress) public {
    basePlatformAddress = _basePlatformAddress;
    zoraMediaAddress = _zoraMediaAddress;
  }

  /* ****************
  * Public Functions
  * ****************
  */

  /**
  * @notice Allows creating of platforms by cloning the originally deployed platform
  */
  function createPlatform() public {
    address instance = Clones.clone(basePlatformAddress);
    IPlatform(instance).init(msg.sender, zoraMediaAddress);
    platforms.push(instance);
    emit PlatformCreated(msg.sender, instance);
  }

  /**
  * @notice Allows admin to upgrade platform contract for bugfixes etc.
  */
  function updateBasePlatformAddress(address _basePlatformAddress) public onlyOwner {
    basePlatformAddress = _basePlatformAddress;
  }
}
