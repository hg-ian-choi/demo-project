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

    function _clone(string memory _name, string memory _symbol)
        external
        returns (address identicalChild)
    {
        identicalChild = _origin.clone();

        ICloneableInitializer(identicalChild).initialize(
            _name,
            _symbol,
            payable(msg.sender)
        );

        emit newClone(identicalChild, msg.sender, _name, _symbol);
    }

    function _msgSender() private view returns (address) {
        return msg.sender;
    }

    function getOrigin() external view onlyOwner returns (address) {
        return _origin;
    }

    function getOwner() external view onlyOwner returns (address) {
        return _owner;
    }

    function transferOwner(address _newOwner) external onlyOwner {
        _owner = _newOwner;
    }

    function upgradeOrigin(address _newOrigin) external onlyOwner {
        _origin = _newOrigin;
    }
}
