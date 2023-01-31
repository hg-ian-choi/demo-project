// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Ownable is Initializable {
    address owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function __Ownable_init(address newOwner_) internal onlyInitializing {
        owner = newOwner_;
        emit OwnershipTransferred(address(0), newOwner_);
    }

    function _checkOwner() internal view virtual {
        require(getOwner() == _sender(), "Ownable: caller is not the owner");
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function _sender() internal view returns (address) {
        return msg.sender;
    }
}
