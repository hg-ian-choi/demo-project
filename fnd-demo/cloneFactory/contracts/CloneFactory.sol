// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ICloneable.sol";

contract CloneFactory {
    using Clones for address;

    address private _owner;
    address private _origin;

    event NewClone(address _newClone, address _creator);

    modifier onlyOwner() {
        require(_owner == _msgSender(), "ERROR: Only Owner");
        _;
    }

    constructor() {
        _owner = _msgSender();
    }

    function _clone(
        string memory _name,
        string memory _symbol,
        address payable _creator
    ) external returns (address identicalChild) {
        identicalChild = _origin.clone();
        ICloneable(identicalChild).initialize(
            _name,
            _symbol,
            payable(_creator)
        );
        emit NewClone(identicalChild, _creator);
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
