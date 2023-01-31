// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./IFactory.sol";

contract Factory {
    using Clones for address;

    address owner;
    address origin;
    address core;

    mapping(address => address) contractToWallet;
    mapping(address => address[]) walletToContractArray;
    mapping(string => bool) ifIdExist;

    event cloneEvent(string indexed id, address indexed creator, string name, string symbol, address indexed newClone);

    modifier onlyOwner() {
        require(owner == _msgSender(), "ERROR: Only Owner");
        _;
    }

    constructor() {
        owner = _msgSender();
    }

    function newClone(
        string memory id_,
        string memory name_,
        string memory symbol_,
        string memory prefix_,
        string memory suffix_
    ) external returns (address) {
        require(!ifIdExist[id_], "Id already exist");
        address _newClone = origin.cloneDeterministic(_genSalt(_msgSender()));

        IFactory(_newClone).initialize(name_, symbol_, core, _msgSender(), prefix_, suffix_);

        contractToWallet[_newClone] = _msgSender();
        walletToContractArray[_msgSender()].push(_newClone);
        ifIdExist[id_] = true;

        emit cloneEvent(id_, _msgSender(), name_, symbol_, _newClone);
        return _newClone;
    }

    // admin functions
    function transferOwner(address newOwner_) external onlyOwner {
        owner = newOwner_;
    }

    function upgradeOrigin(address newOrigin_) external onlyOwner {
        origin = newOrigin_;
    }

    function upgradeCore(address newCore_) external onlyOwner {
        core = newCore_;
    }

    // view functions
    function getOrigin() external view returns (address) {
        return origin;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function getCore() external view returns (address) {
        return core;
    }

    function getContractOwner(address contract_) external view returns (address) {
        return contractToWallet[contract_];
    }

    function getWalletContracts(address wallet_) external view returns (address[] memory) {
        return walletToContractArray[wallet_];
    }

    // private functions
    function _msgSender() private view returns (address) {
        return msg.sender;
    }

    function _genSalt(address msgSender_) private view returns (bytes32) {
        uint96 time = uint96(block.timestamp);
        return bytes32((uint256(uint160(msgSender_)) << 96) | uint256(time));
    }
}
