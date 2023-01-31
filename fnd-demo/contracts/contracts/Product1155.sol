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

contract Product1155 is Initializable, Ownable, PausableUpgradeable, ERC1155Upgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter tokenId;

    string public name;
    string public symbol;
    string prefix;
    string suffix;
    address core;

    mapping(uint256 => string) tokenURI;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address core_,
        address sender_,
        string memory prefix_,
        string memory suffix_
    ) public initializer {
        name = name_;
        symbol = symbol_;
        core = core_;
        prefix = prefix_;
        suffix = suffix_;
        __ERC1155_init("");
        __Ownable_init(sender_);
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
    }

    function mint(uint256 amount_, string memory uri_, bytes memory data_) public onlyOwner returns (uint256) {
        tokenId.increment();
        uint256 _tokenId = getCurrentTokenId();
        tokenURI[_tokenId] = uri_;
        _mint(_msgSender(), _tokenId, amount_, data_);
        setApprovalForAll(core, true);
        return _tokenId;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address operator_,
        address from_,
        address to_,
        uint256[] memory ids_,
        uint256[] memory amounts_,
        bytes memory data_
    ) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) whenNotPaused {
        super._beforeTokenTransfer(operator_, from_, to_, ids_, amounts_, data_);
    }

    function uri(uint256 id_) public view override returns (string memory) {
        return string.concat(prefix, tokenURI[id_], suffix);
    }

    function getCurrentTokenId() public view returns (uint256) {
        return tokenId.current();
    }
}
