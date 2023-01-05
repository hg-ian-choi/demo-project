// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ICloneable {
    function initialize(
        string memory _name,
        string memory _symbol,
        address payable _sender
    ) external;
}
