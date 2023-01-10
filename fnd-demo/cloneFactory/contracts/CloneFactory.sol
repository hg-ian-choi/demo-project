// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ICloneableInitializer.sol";

contract CloneFactory {
    using Clones for address;

    address private _owner;
    address private _origin;

    event newClone(
        address indexed newClone,
        address indexed creator,
        string name,
        string symbol
    );

    modifier onlyOwner() {
        require(_owner == _msgSender(), "ERROR: Only Owner");
        _;
    }

    constructor() {
        _owner = _msgSender();
    }

    function _clone(string memory name_, string memory symbol_)
        external
        returns (address identicalChild_)
    {
        identicalChild_ = _origin.clone();

        ICloneableInitializer(identicalChild_).initialize(
            name_,
            symbol_,
            payable(_msgSender())
        );

        emit newClone(identicalChild_, _msgSender(), name_, symbol_);
    }

    function getOrigin() external view onlyOwner returns (address) {
        return _origin;
    }

    function getOwner() external view onlyOwner returns (address) {
        return _owner;
    }

    function transferOwner(address newOwner_) external onlyOwner {
        _owner = newOwner_;
    }

    function upgradeOrigin(address newOrigin_) external onlyOwner {
        _origin = newOrigin_;
    }

    function _msgSender() private view returns (address) {
        return msg.sender;
    }
}
