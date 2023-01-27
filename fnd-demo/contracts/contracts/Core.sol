// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./ICloneable.sol";

contract Core is ERC1155Holder {
    address payable _owner;

    struct Product {
        address payable seller;
        uint256 amount;
        uint256 price;
    }

    mapping(address => mapping(address => mapping(uint256 => Product))) addressToContractToTokenToProduct;
    mapping(address => address payable) artist;
    mapping(address => uint256) ethBalance;

    event receiveExtraEvent(address indexed sender, uint256 value);
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
    event depositEvent(address indexed sender, uint256 value, uint256 balance);
    event withdrawEvent(address indexed sender, uint256 value, uint256 balance);
    event adminWithdrawEvent(uint256 value, uint256 balance);

    constructor() {
        _owner = _msgSender();
    }

    modifier onlyOwner() {
        require(_msgSender() == _owner, "Only Owner");
        _;
    }

    // view functions
    function owner() external view returns (address) {
        return _owner;
    }

    function getProductInfo(address seller_, address contract_, uint256 tokenId_) external view returns (Product memory) {
        return addressToContractToTokenToProduct[seller_][contract_][tokenId_];
    }

    function balanceOf(address contract_, uint256 id_) internal view returns (uint256) {
        return ICloneable(contract_).balanceOf(_msgSender(), id_);
    }

    // setProduct, cancelProduct, buyProduct
    function setProduct(address contract_, uint256 id_, uint256 amount_, uint256 price_) external payable {
        require(amount_ > 0, "Amount is 0");
        uint256 _balance = ICloneable(contract_).balanceOf(_msgSender(), id_);
        require(_balance >= amount_, "Not sufficient balance");
        require(price_ > 0, "Price should > 0");

        if (artist[contract_] == address(0)) {
            artist[contract_] = ICloneable(contract_).owner();
        }

        Product memory _product = addressToContractToTokenToProduct[_msgSender()][contract_][id_];

        if (_product.seller == address(0)) {
            _product.seller = _msgSender();
            _product.amount = amount_;
            _product.price = price_;
            addressToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;

            ICloneable(contract_).safeTransferFrom(_msgSender(), address(this), id_, amount_, "0x00");
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
            } else {
                _product.price = price_;
                addressToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
            }
        }
    }

    function cancelProduct(address payable contract_, uint256 id_, uint256 amount_) external payable {
        require(amount_ > 0, "Amount should > 0");

        Product memory _product = addressToContractToTokenToProduct[_msgSender()][contract_][id_];

        require(_product.seller != address(0), "Product is not on sale");
        require(amount_ <= _product.amount, "Amount should less than selling");

        if (amount_ == _product.amount) {
            ICloneable(contract_).safeTransferFrom(address(this), _msgSender(), id_, amount_, "0x00");
            delete addressToContractToTokenToProduct[_msgSender()][contract_][id_];
        } else {
            ICloneable(contract_).safeTransferFrom(address(this), _msgSender(), id_, amount_, "0x00");
            _product.amount = _product.amount - amount_;
            addressToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
        }
    }

    function buyProduct(address payable seller_, address payable contract_, uint256 id_, uint256 amount_) external payable {
        Product memory sell = addressToContractToTokenToProduct[seller_][contract_][id_];

        require(sell.seller != _msgSender(), "Can not buy own Product");
        require(sell.seller != address(0), "Product not exist");
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
            emit receiveExtraEvent(_msgSender(), msg.value - totalPrice);
        }

        if (amount_ == sell.amount) {
            delete addressToContractToTokenToProduct[seller_][contract_][id_];
        } else {
            sell.amount = sell.amount - amount_;
            addressToContractToTokenToProduct[seller_][contract_][id_] = sell;
        }

        ICloneable(contract_).safeTransferFrom(address(this), _msgSender(), id_, amount_, "0x00");
        emit buyProductEvent(sell.seller, _msgSender(), contract_, id_, amount_, sell.price, totalPrice, msg.value, msg.value - totalPrice);
    }

    // balance enquiry, deposit, withdraw
    function getBalance() external view returns (uint256) {
        return ethBalance[_msgSender()];
    }

    function deposit(uint256 value_) public payable returns (uint256 _balance) {
        _balance = ethBalance[_msgSender()];
        (bool sent, ) = payable(address(this)).call{value: value_}("");
        require(sent, "Failed to deposit");
        ethBalance[_msgSender()] = _balance + value_;
        emit depositEvent(_msgSender(), value_, _balance);
    }

    function withdraw(uint256 value_) public payable returns (uint256 _balance) {
        _balance = ethBalance[_msgSender()];
        require(_balance >= value_, "Not sufficient funds");
        (bool sent, ) = _msgSender().call{value: value_}("");
        require(sent, "Failed to withdraw");
        ethBalance[_msgSender()] = _balance - value_;
        emit withdrawEvent(_msgSender(), value_, _balance);
    }

    // admin functions
    function adminGetBalance(address operator_) public view onlyOwner returns (uint256) {
        return ethBalance[operator_];
    }

    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function transferOwner(address payable newOwner_) external onlyOwner {
        _owner = newOwner_;
    }

    function adminWithdraw(uint256 value_) external payable onlyOwner returns (uint256 _newBalance) {
        require(address(this).balance >= value_, "Not sufficient funds");
        (bool sent, ) = _owner.call{value: value_}("");
        require(sent, "Failed to adminWithDraw");
        _newBalance = address(this).balance;
        emit adminWithdrawEvent(value_, _newBalance);
        return _newBalance;
    }

    // private functions
    function _msgSender() private view returns (address payable) {
        return payable(msg.sender);
    }

    // functions must exist
    receive() external payable {}
}
