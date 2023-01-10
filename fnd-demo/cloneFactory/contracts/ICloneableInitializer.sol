// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ICloneableInitializer {
    function initialize(
        string memory name_,
        string memory symbol_,
        address payable creator_
    ) external;
}
