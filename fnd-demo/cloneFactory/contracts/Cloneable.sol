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

contract Cloneable is
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
        string memory _name,
        string memory _symbol,
        address payable _operator,
        address payable _sender
    ) public initializer {
        name = _name;
        symbol = _symbol;
        operator = _operator;
        __ERC1155_init("");
        __Ownable_init(_sender);
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        tokenURI[id] = Strings.toString(id);
        _mint(account, id, amount, data);
    }

    function mintAndApprove(uint256 _amount, bytes memory _data)
        external
        onlyOwner
        returns (uint256 _tokenId)
    {
        tokenId.increment();
        _tokenId = tokenId.current();
        _mint(_Sender(), _tokenId, _amount, _data);
        setApprovalForAll(operator, true);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address _operator,
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        bytes memory _data
    )
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
        whenNotPaused
    {
        super._beforeTokenTransfer(
            _operator,
            _from,
            _to,
            _ids,
            _amounts,
            _data
        );
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return string.concat(prefix, tokenURI[_id], suffix);
    }

    function setPrefixAndSuffix(string memory _Prefix, string memory _Suffix)
        external
        onlyOwner
    {
        prefix = _Prefix;
        suffix = _Suffix;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return tokenId.current();
    }
}
