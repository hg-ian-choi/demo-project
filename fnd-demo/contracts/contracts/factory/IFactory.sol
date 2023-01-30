// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IFactory {
    function initialize(
        string memory name_,
        string memory symbol_,
        address payable core_,
        address payable sender_,
        string memory prefix_,
        string memory suffix_
    ) external;
}
