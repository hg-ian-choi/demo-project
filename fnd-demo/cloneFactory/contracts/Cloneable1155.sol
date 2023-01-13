// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Ownable.sol";

contract Cloneable1155 is
    Initializable,
    Ownable,
    PausableUpgradeable,
    ERC1155Upgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155SupplyUpgradeable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    string public name;
    string public symbol;
    string private _prefix;
    string private _suffix;
    address payable private _core;
    bytes private _data;

    mapping(uint256 => string) tokenURI;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address payable core_,
        address payable sender_,
        bytes memory data_
    ) public initializer {
        name = name_;
        symbol = symbol_;
        _core = core_;
        _data = data_;
        __ERC1155_init("");
        __Ownable_init(sender_);
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mintAndApproval(
        uint256 amount_,
        string memory uri_,
        bytes memory data_
    ) public onlyOwner {
        _tokenId.increment();
        uint tokenId = _tokenId.current();
        tokenURI[tokenId] = uri_;
        _mint(_sender(), tokenId, amount_, data_);
        setApprovalForAll(_core, true);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public virtual override {
        require(operator == _core, "Can not Approval");
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(keccak256(data) == keccak256(_data), "Can not Transfer");
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner or approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
    }

    function _beforeTokenTransfer(
        address operator_,
        address from_,
        address to_,
        uint256[] memory ids_,
        uint256[] memory amounts_,
        bytes memory data_
    )
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
        whenNotPaused
    {
        super._beforeTokenTransfer(
            operator_,
            from_,
            to_,
            ids_,
            amounts_,
            data_
        );
    }

    function uri(uint256 id_) public view override returns (string memory) {
        return string.concat(_prefix, tokenURI[id_], _suffix);
    }

    function setPrefixAndSuffix(
        string memory prefix_,
        string memory suffix_
    ) external onlyOwner {
        _prefix = prefix_;
        _suffix = suffix_;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenId.current();
    }
}
