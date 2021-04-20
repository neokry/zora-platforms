//SPDX-License-Identifier: Unlicense
pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import { IMedia } from "@zoralabs/core/dist/contracts/interfaces/IMedia.sol";
import { IMarket } from "@zoralabs/core/dist/contracts/interfaces/IMarket.sol";

/**
 * @title A platform that keeps track of artworks minted through it.
 * @notice This contract provides an implementation for zora sub platforms with roles.
 */
contract Platform is AccessControl {

    /* *******
    * Globals
    * *******
    */

    //Zora media contract
    IMedia ZoraMedia;

    //List of artwork hashes that have been minted through the platform
    bytes32[] public contentHashes;

    //Platform owner role (Owners can add in new creators, mint artworks and edit site settings on the frontend)
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    //Platform creator role (Creators can mint artworks through the platform)
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    //Flag to specify initilization state
    bool private _isInitilized;

    /* **************
    * Modifiers
    * **************
    */

    /**
    * @dev Modifier to check whether the `msg.sender` is the a platform owner or admin.
    * If it is, it will run the function. Otherwise, it will revert.
    */
    modifier onlyOwner() {
        require(hasRole(OWNER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Owner required");
        _;
    }

     /**
    * @dev Modifier to check whether the `msg.sender` is the a platform creator, owner or admin.
    * If it is, it will run the function. Otherwise, it will revert.
    */
    modifier onlyOwnerOrCreator() {
        require(hasRole(OWNER_ROLE, msg.sender) || hasRole(CREATOR_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Creator required");
        _;
    }


    /**
     * @notice Constructor is not called during clone so an initilize method must be used.
     * Sets the default roles for the specified platform owner
     * Makes creator a sub role with admin being the dominant role
     * Sets up zora media contract.
     */
    function init(address owner, address _zoraMediaAddress) public {
        require(_isInitilized == false);
        _setupRole(DEFAULT_ADMIN_ROLE, owner);
        _setupRole(OWNER_ROLE, owner);
        _setRoleAdmin(CREATOR_ROLE, OWNER_ROLE);
        ZoraMedia = IMedia(_zoraMediaAddress);
        _isInitilized = true;
    }

    /* **************
    * View Functions
    * **************
    */

    /**
     * @notice Gets all content hashes minted through the platform.
     */
    function getAllContentHashes() public view returns (bytes32[] memory) {
        return contentHashes;
    }

    /**
     * @notice Gets all members of the specified role.
     */
    function getRoleMembers(bytes32 _role) public view returns (address[] memory) {
        uint count = getRoleMemberCount(_role);
        address[] memory members = new address[](count);
        for (uint256 idx = 0; idx < count; idx++) {
            members[idx] = getRoleMember(_role, idx);
        }
        return members;
    }

    /* ****************
    * Public Functions
    * ****************
    */

    /**
     * @notice Mints an artwork with a valid signature.
     */
    function mintWithSig(IMedia.MediaData memory _data, IMarket.BidShares memory _shares, IMedia.EIP712Signature memory _sig) public onlyOwnerOrCreator {
        ZoraMedia.mintWithSig(msg.sender, _data, _shares, _sig); 
        contentHashes.push(_data.contentHash);
    }

    /**
     * @notice Sets multiple members for a given role. 
     * Utility function used to minimize gas costs.
     */
    function batchSetRole(bytes32 _role, address[] memory members) public onlyOwner {
        for (uint256 idx = 0; idx < members.length; idx++) {
            grantRole(_role, members[idx]);
        }
    }
}