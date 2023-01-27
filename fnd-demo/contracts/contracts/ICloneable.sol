// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ICloneable {
    function initialize(
        string memory name_,
        string memory symbol_,
        address payable core_,
        address payable sender_,
        string memory prefix_,
        string memory suffix_
    ) external;

    function balanceOf(address account, uint256 id) external view returns (uint256);

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;

    function owner() external view returns (address payable);
}
