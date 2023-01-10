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
    string public name;
    string public symbol;
    string private prefix;
    string private suffix;
    address payable private operator;
    Counters.Counter private tokenId;

    mapping(uint256 => string) tokenURI;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address payable operator_,
        address payable sender_
    ) public initializer {
        name = name_;
        symbol = symbol_;
        operator = operator_;
        __ERC1155_init("");
        __Ownable_init(sender_);
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
    }

    function setURI(string memory newuri_) public onlyOwner {
        _setURI(newuri_);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(
        address account_,
        uint256 id_,
        uint256 amount_,
        bytes memory data_
    ) public onlyOwner {
        tokenURI[id_] = Strings.toString(id_);
        _mint(account_, id_, amount_, data_);
    }

    function mintAndApprove(uint256 amount_, bytes memory data_)
        external
        onlyOwner
        returns (uint256 tokenId_)
    {
        tokenId.increment();
        tokenId_ = tokenId.current();
        _mint(_Sender(), tokenId_, amount_, data_);
        setApprovalForAll(operator, true);
    }

    function mintBatch(
        address to_,
        uint256[] memory ids_,
        uint256[] memory amounts_,
        bytes memory data_
    ) public onlyOwner {
        _mintBatch(to_, ids_, amounts_, data_);
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
        return string.concat(prefix, tokenURI[id_], suffix);
    }

    function setPrefixAndSuffix(string memory prefix_, string memory suffix_)
        external
        onlyOwner
    {
        prefix = prefix_;
        suffix = suffix_;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return tokenId.current();
    }
}
