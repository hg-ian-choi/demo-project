// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface I1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;

    function owner() external view returns (address payable);
}
