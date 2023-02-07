// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Product1155 is Initializable, PausableUpgradeable, ERC1155Upgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter tokenId;

    string public name;
    string public symbol;
    address owner;
    address core;

    mapping(uint256 => string) tokenURI;
    mapping(address => uint256[]) addressToTokenIdArray;

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    event mintEvent(string indexed id, address indexed creater, uint256 indexed tokenId, uint256 amount);

    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name_, string memory symbol_, address core_, address sender_) public initializer {
        name = name_;
        symbol = symbol_;
        core = core_;
        owner = sender_;
        __ERC1155_init("");
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
    }

    function mint(string memory id_, uint256 amount_, string memory uri_, bytes memory data_) public onlyOwner returns (uint256) {
        tokenId.increment();
        uint256 _tokenId = getCurrentTokenId();
        tokenURI[_tokenId] = uri_;
        _mint(_msgSender(), _tokenId, amount_, data_);
        setApprovalForAll(core, true);
        addressToTokenIdArray[_msgSender()].push(_tokenId);
        emit mintEvent(id_, _msgSender(), _tokenId, amount_);
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

    function safeTransferFrom(address from_, address to_, uint256 tokenId_, uint256 amount_, bytes memory data_) public override {
        require(
            from_ == _msgSender() || _msgSender() == core || isApprovedForAll(from_, _msgSender()),
            "ERC1155: caller is not token owner or approved"
        );

        uint256 _tokenBalance = balanceOf(from_, tokenId_);

        if (amount_ == _tokenBalance) {
            int256 _fromIndex = _indexOf(addressToTokenIdArray[from_], tokenId_);
            _removeAddressToTokenElement(addressToTokenIdArray[from_], uint256(_fromIndex));
        }

        int256 _toIndex = _indexOf(addressToTokenIdArray[to_], tokenId_);

        if (_toIndex < 0) {
            addressToTokenIdArray[to_].push(tokenId_);
        }

        _safeTransferFrom(from_, to_, tokenId_, amount_, data_);
    }

    function burn(address from_, uint256 tokenId_, uint256 amount_) public override {
        require(from_ == _msgSender() || isApprovedForAll(from_, _msgSender()), "ERC1155: caller is not token owner or approved");

        if (amount_ == balanceOf(from_, tokenId_)) {
            int256 _index = _indexOf(addressToTokenIdArray[from_], tokenId_);
            if (_index >= 0) {
                _removeAddressToTokenElement(addressToTokenIdArray[from_], uint256(_index));
            }
        }

        _burn(from_, tokenId_, amount_);
    }

    function uri(uint256 id_) public view override returns (string memory) {
        return tokenURI[id_];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return tokenId.current();
    }

    function getAddressTokens(address address_) public view returns (uint256[] memory) {
        return addressToTokenIdArray[address_];
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // private functions
    function _indexOf(uint256[] memory array_, uint256 searchFor_) private pure returns (int256) {
        for (uint256 i = 0; i < array_.length; i++) {
            if (array_[i] == searchFor_) {
                return int256(i);
            }
        }
        return -1;
    }

    function _removeAddressToTokenElement(uint256[] storage array_, uint256 removeFor_) private {
        for (uint256 i = removeFor_; i < array_.length - 1; i++) {
            array_[i] = array_[i + 1];
        }
        array_.pop();
    }

    function _checkOwner() private view {
        require(owner == _msgSender(), "Ownable: caller is not the owner");
    }
}
