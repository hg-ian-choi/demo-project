// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ICloneable.sol";

contract Core {
    address payable private _owner;

    struct Product {
        address payable seller;
        uint256 amount;
        uint256 price;
    }

    mapping(address => mapping(address => mapping(uint256 => Product))) contractToTokenToAddressToProduct;

    constructor() {
        _owner = _msgSender();
    }

    modifier onlyOwner() {
        require(_msgSender() == _owner, "Only Owner");
        _;
    }

    function transferOwner(address payable newOwner_) external onlyOwner {
        _owner = newOwner_;
    }

    function balanceOf(
        address contract_,
        uint256 id_
    ) internal view returns (uint256) {
        return ICloneable(contract_).balanceOf(_msgSender(), id_);
    }

    function _msgSender() private view returns (address payable) {
        return payable(msg.sender);
    }

    function setProduct(
        address contract_,
        uint256 id_,
        uint256 amount_,
        uint256 price_
    ) external {
        uint256 _balance = ICloneable(contract_).balanceOf(_msgSender(), id_);
        require(_balance >= amount_, "Not sufficient balance");

        Product memory _product = contractToTokenToAddressToProduct[contract_][
            _msgSender()
        ][id_];

        if (_product.seller == address(0)) {
            _product.seller = _msgSender();
        }
        _product.amount = amount_;
        _product.price = price_;

        contractToTokenToAddressToProduct[contract_][_msgSender()][
            id_
        ] = _product;

        ICloneable(contract_).safeTransferFrom(
            _msgSender(),
            address(this),
            id_,
            amount_,
            "0x00"
        );
    }

    function buyProduct(
        address payable contract_,
        uint256 id_,
        uint256 amount_,
        uint256 price_
    ) external payable {
        Product memory sell = contractToTokenToAddressToProduct[contract_][
            _msgSender()
        ][id_];

        require(price_ >= sell.price, "Not sufficient funds");
        require(amount_ <= sell.amount, "Not sufficient amount");

        (bool sent, bytes memory data) = sell.seller.call{value: price_}("");

        require(sent, "Failed to sent ether!");
    }
}
