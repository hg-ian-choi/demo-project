// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ICloneable.sol";

contract CloneFactory {
    using Clones for address;

    address private _owner;
    address private _origin;
    address payable private _core;
    mapping(address => address) contractToWallet;
    mapping(address => address[]) walletToContractArray;

    event newClone(address indexed newClone, address indexed creator, string name, string symbol);

    modifier onlyOwner() {
        require(_owner == _msgSender(), "ERROR: Only Owner");
        _;
    }

    constructor(address payable core_) {
        _owner = _msgSender();
        _core = core_;
    }

    function _clone(string memory name_, string memory symbol_, string memory prefix_, string memory suffix_) external returns (address newClone_) {
        newClone_ = _origin.cloneDeterministic(_genSalt(_msgSender()));

        ICloneable(newClone_).initialize(name_, symbol_, _core, payable(_msgSender()), prefix_, suffix_);

        contractToWallet[newClone_] = _msgSender();
        walletToContractArray[_msgSender()].push(newClone_);

        emit newClone(newClone_, _msgSender(), name_, symbol_);
    }

    function transferOwner(address newOwner_) external onlyOwner {
        _owner = newOwner_;
    }

    function upgradeOrigin(address newOrigin_) external onlyOwner {
        _origin = newOrigin_;
    }

    function getOrigin() external view returns (address) {
        return _origin;
    }

    function getOwner() external view returns (address) {
        return _owner;
    }

    function getCore() external view returns (address) {
        return _core;
    }

    function getContractOwner(address contract_) external view returns (address) {
        return contractToWallet[contract_];
    }

    function getWalletContracts(address wallet_) external view returns (address[] memory) {
        return walletToContractArray[wallet_];
    }

    function _msgSender() private view returns (address) {
        return msg.sender;
    }

    function _genSalt(address msgSender_) private view returns (bytes32) {
        uint96 time = uint96(block.timestamp);
        return bytes32((uint256(uint160(msgSender_)) << 96) | uint256(time));
    }
}
