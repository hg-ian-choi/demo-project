// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IProduct1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;

    function getOwner() external view returns (address);
}
