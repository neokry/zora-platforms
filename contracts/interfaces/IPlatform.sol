// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.8;

interface IPlatform {
    function init(address owner, address _zoraMediaAddress) external;
    function initWithRoles(address[] calldata _admins, address[] calldata _owners, address[] calldata _creators, address _zoraMediaAddress) external;
}