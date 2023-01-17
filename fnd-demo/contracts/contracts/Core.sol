// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./ICloneable.sol";
import "hardhat/console.sol";

contract Core is ERC1155Holder {
    address payable private _owner;

    struct Product {
        address payable seller;
        uint256 amount;
        uint256 price;
    }

    mapping(address => mapping(address => mapping(uint256 => Product))) addressToContractToTokenToProduct;
    mapping(address => address payable) artist;

    event receiveExtra(address sender, uint256 value);
    event buyProductEvent(
        address seller,
        address buyer,
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 totalPrice,
        uint256 buyerPay,
        uint256 extraValue
    );
    event withdraw(uint256 value);

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

    function balanceOf(address contract_, uint256 id_) internal view returns (uint256) {
        return ICloneable(contract_).balanceOf(_msgSender(), id_);
    }

    function _msgSender() private view returns (address payable) {
        return payable(msg.sender);
    }

    function setProduct(address contract_, uint256 id_, uint256 amount_, uint256 price_) external payable {
        require(amount_ > 0, "Amount is 0");
        uint256 _balance = ICloneable(contract_).balanceOf(_msgSender(), id_);
        require(_balance >= amount_, "Not sufficient balance");
        require(price_ >= 0, "Price should >= 0");
        console.log("_balance", _balance);

        if (artist[contract_] == address(0)) {
            artist[contract_] = ICloneable(contract_).owner();
        }
        console.log("artist[contract_]", artist[contract_]);

        Product memory _product = addressToContractToTokenToProduct[_msgSender()][contract_][id_];
        console.log("_product.seller", _product.seller);
        console.log("_product.amount", _product.amount);
        console.log("_product.price", _product.price);

        if (_product.seller == address(0)) {
            require(price_ > 0, "Price is 0");
            _product.seller = _msgSender();

            _product.amount = amount_;
            _product.price = price_;

            addressToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;

            ICloneable(contract_).safeTransferFrom(_msgSender(), address(this), id_, amount_, "0x00");
        } else {
            if (price_ == 0) {
                ICloneable(contract_).safeTransferFrom(address(this), _msgSender(), id_, _product.amount, "0x00");
                delete addressToContractToTokenToProduct[_msgSender()][contract_][id_];
            } else {
                if (amount_ < _product.amount) {
                    ICloneable(contract_).safeTransferFrom(address(this), _msgSender(), id_, _product.amount - amount_, "0x00");
                    _product.amount = amount_;
                    _product.price = price_;
                    addressToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
                } else if (amount_ > _product.amount) {
                    ICloneable(contract_).safeTransferFrom(_msgSender(), address(this), id_, amount_ - _product.amount, "0x00");
                    _product.amount = amount_;
                    _product.price = price_;
                    addressToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
                }
            }
        }
    }

    function buyProduct(address payable contract_, uint256 id_, uint256 amount_) external payable {
        Product memory sell = addressToContractToTokenToProduct[_msgSender()][contract_][id_];

        require(sell.seller != _msgSender(), "Can not buy own Product");
        require(sell.price > 0, "Can not buy Product whose price is 0");
        require(sell.amount > 0, "Can not buy Product whose amount is 0");
        require(msg.value >= sell.price, "Not sufficient funds");
        require(amount_ <= sell.amount, "Not sufficient sell amount");
        require(amount_ > 0, "Can not buy 0 Product");

        uint256 totalPrice = sell.price * amount_;

        uint256 sellerValue = (totalPrice * 92) / 100;
        uint256 ownerValue = (totalPrice * 3) / 100;
        uint256 artistvalue = (totalPrice * 5) / 100;

        (bool sentToSeller, ) = sell.seller.call{value: sellerValue}("");
        (bool sentToOwner, ) = _owner.call{value: ownerValue}("");
        (bool sentToArtist, ) = artist[contract_].call{value: artistvalue}("");

        require(sentToSeller, "Failed to send to Seller!");
        require(sentToOwner, "Failed to send to Owner!");
        require(sentToArtist, "Failed to send to Artist!");

        if (msg.value > totalPrice) {
            emit receiveExtra(msg.sender, msg.value - totalPrice);
        }

        if (amount_ == sell.amount) {
            delete addressToContractToTokenToProduct[_msgSender()][contract_][id_];
        } else {
            sell.amount = sell.amount - amount_;
            addressToContractToTokenToProduct[_msgSender()][contract_][id_] = sell;
        }

        emit buyProductEvent(sell.seller, msg.sender, contract_, id_, amount_, sell.price, totalPrice, msg.value, msg.value - totalPrice);
    }

    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function owner() external view returns (address) {
        return _owner;
    }

    function withdrawToOwner() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool sent, ) = _owner.call{value: balance}("");
        require(sent, "Failed to withdraw");
        emit withdraw(balance);
    }

    receive() external payable {}
}
