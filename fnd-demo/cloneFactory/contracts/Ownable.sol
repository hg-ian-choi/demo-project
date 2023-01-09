// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Ownable is Initializable {
    address payable private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function __Ownable_init(address payable _newOwner)
        internal
        onlyInitializing
    {
        __Ownable_init_unchained(_newOwner);
    }

    function __Ownable_init_unchained(address payable _newOwner)
        internal
        onlyInitializing
    {
        _transferOwnership(_newOwner);
    }

    function _transferOwnership(address payable _newOwner) internal virtual {
        address payable oldOwner = _owner;
        _owner = _newOwner;
        emit OwnershipTransferred(oldOwner, _newOwner);
    }

    function _checkOwner() internal view virtual {
        require(owner() == _Sender(), "Ownable: caller is not the owner");
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _Sender() internal view virtual returns (address) {
        return msg.sender;
    }
}
