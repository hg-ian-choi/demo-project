// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ICloneable.sol";

contract CloneFactory {
    using Clones for address;

    address public owner;
    address public origin;

    event NewClone(address _newClone, address _owner);

    modifier onlyOwner() {
        require(owner == msg.sender, "ERROR: Only Owner");
        _;
    }

    constructor(address _origin) {
        owner = msg.sender;
        origin = _origin;
    }

    function cloneMain() external returns (string memory _name, string memory _symbol, address identicalChild) {
        identicalChild = origin.clone();
        IMain(identicalChild).initialize(_name, _symbol, payable(msg.sender));
        emit NewClone(identicalChild, msg.sender);
    }

    function upgradeOrigin(address _origin) public onlyOwner {
        origin = _origin;
    }
}
