pragma solidity ^0.8.0;

import "../interfaces/IMedia.sol";

contract MockMedia is IMedia {
    function mintWithSig(
        address creator,
        MediaData calldata data,
        BidShares calldata bidShares,
        EIP712Signature calldata sig
    ) override public {
        return;
    }
}