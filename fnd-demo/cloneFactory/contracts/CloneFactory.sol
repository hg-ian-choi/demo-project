// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ICloneable.sol";

contract CloneFactory {
    using Clones for address;

    address private _owner;
    address private _origin;

    /**
     * @notice Emitted when a new NFTCollection is created from this factory.
     * @param collection The address of the new NFT collection contract.
     * @param creator The address of the creator which owns the new collection.
     * @param name The name of the collection contract created.
     * @param symbol The symbol of the collection contract created.
     * @param nonce The nonce used by the creator when creating the collection,
     * used to define the address of the collection.
     */
    event NFTCollectionCreated(
        address indexed collection,
        address indexed creator,
        string name,
        string symbol,
        uint256 nonce
    );

    modifier onlyOwner() {
        require(_owner == _msgSender(), "ERROR: Only Owner");
        _;
    }

    constructor() {
        _owner = _msgSender();
    }

    function _clone(
        string memory _name,
        string memory _symbol,
        uint96 _nonce
    ) external returns (address identicalChild) {
        identicalChild = _origin.cloneDeterministic(
            _getSalt(msg.sender, _nonce)
        );

        ICloneable(identicalChild).initialize(
            _name,
            _symbol,
            payable(msg.sender)
        );

        emit NFTCollectionCreated(
            identicalChild,
            msg.sender,
            _name,
            _symbol,
            _nonce
        );
    }

    function _msgSender() private view returns (address) {
        return msg.sender;
    }

    function getOrigin() external view onlyOwner returns (address) {
        return _origin;
    }

    function getOwner() external view onlyOwner returns (address) {
        return _owner;
    }

    function transferOwner(address _newOwner) external onlyOwner {
        _owner = _newOwner;
    }

    function upgradeOrigin(address _newOrigin) external onlyOwner {
        _origin = _newOrigin;
    }

    /**
     * @dev Salt is address + nonce packed.
     */
    function _getSalt(address creator, uint96 nonce)
        private
        pure
        returns (bytes32)
    {
        return bytes32((uint256(uint160(creator)) << 96) | uint256(nonce));
    }
}
