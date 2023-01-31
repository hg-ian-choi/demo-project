// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../I1155.sol";

contract Core is ERC1155Holder {
    address owner;

    struct Product {
        address seller;
        uint256 amount;
        uint256 price;
    }

    mapping(address => mapping(address => mapping(uint256 => Product))) walletToContractToTokenToProduct;
    mapping(address => address) creator; // contractToWallet
    mapping(address => uint256) ethBalance;

    event receiveExtraEvent(address indexed sender, uint256 value);
    event setProductEvent(address indexed seller, address indexed tokenAddress, uint256 indexed tokenId, uint256 price, uint256 amount);
    event buyProductEvent(
        address seller,
        address indexed buyer,
        address indexed tokenAddress,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price,
        uint256 totalPrice,
        uint256 buyerPay,
        uint256 extraValue
    );
    event depositEvent(address indexed sender, uint256 value, uint256 balance);
    event withdrawEvent(address indexed sender, uint256 value, uint256 balance);
    event adminWithdrawEvent(uint256 indexed value, uint256 balance);

    constructor() {
        owner = _msgSender();
    }

    modifier onlyOwner() {
        require(_msgSender() == owner, "Only Owner");
        _;
    }

    // view functions
    function getOwner() external view returns (address) {
        return owner;
    }

    function getProductInfo(address seller_, address contract_, uint256 tokenId_) external view returns (Product memory) {
        return walletToContractToTokenToProduct[seller_][contract_][tokenId_];
    }

    function balanceOf(address contract_, uint256 id_) internal view returns (uint256) {
        return I1155(contract_).balanceOf(_msgSender(), id_);
    }

    // setProduct, cancelProduct, buyProduct
    function setProduct(address contract_, uint256 id_, uint256 amount_, uint256 price_) external {
        require(amount_ > 0, "Amount is 0");
        uint256 _balance = I1155(contract_).balanceOf(_msgSender(), id_);
        require(_balance >= amount_, "Not sufficient balance");
        require(price_ > 10000000000000000, "Price should > 0.01 ETH");

        if (creator[contract_] == address(0)) {
            creator[contract_] = I1155(contract_).getOwner();
        }

        Product memory _product = walletToContractToTokenToProduct[_msgSender()][contract_][id_];

        if (_product.seller == address(0)) {
            _product.seller = _msgSender();
            _product.amount = amount_;
            _product.price = price_;
            walletToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;

            I1155(contract_).safeTransferFrom(_msgSender(), address(this), id_, amount_, "0x00");
        } else {
            if (amount_ < _product.amount) {
                I1155(contract_).safeTransferFrom(address(this), _msgSender(), id_, _product.amount - amount_, "0x00");
                _product.amount = amount_;
                _product.price = price_;
                walletToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
            } else if (amount_ > _product.amount) {
                I1155(contract_).safeTransferFrom(_msgSender(), address(this), id_, amount_ - _product.amount, "0x00");
                _product.amount = amount_;
                _product.price = price_;
                walletToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
            } else {
                _product.price = price_;
                walletToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
            }
        }
        emit setProductEvent(_msgSender(), contract_, id_, price_, amount_);
    }

    function cancelProduct(address payable contract_, uint256 id_, uint256 amount_) external {
        require(amount_ > 0, "Amount should > 0");

        Product memory _product = walletToContractToTokenToProduct[_msgSender()][contract_][id_];

        require(_product.seller != address(0), "Product is not on sale");
        require(amount_ <= _product.amount, "Amount should less than selling");

        if (amount_ == _product.amount) {
            I1155(contract_).safeTransferFrom(address(this), _msgSender(), id_, amount_, "0x00");
            delete walletToContractToTokenToProduct[_msgSender()][contract_][id_];
        } else {
            I1155(contract_).safeTransferFrom(address(this), _msgSender(), id_, amount_, "0x00");
            _product.amount = _product.amount - amount_;
            walletToContractToTokenToProduct[_msgSender()][contract_][id_] = _product;
        }
        emit setProductEvent(_msgSender(), contract_, id_, 0, amount_);
    }

    function buyProduct(address payable seller_, address payable contract_, uint256 id_, uint256 amount_) external payable {
        Product memory sell = walletToContractToTokenToProduct[seller_][contract_][id_];

        require(sell.seller != _msgSender(), "Can not buy own Product");
        require(sell.seller != address(0), "Product not exist");
        require(sell.price > 0, "Can not buy Product whose price is 0");
        require(sell.amount > 0, "Can not buy Product whose amount is 0");
        // require(msg.value >= sell.price, "Not sufficient funds");
        require(amount_ <= sell.amount, "Not sufficient sell amount");
        require(amount_ > 0, "Can not buy 0 Product");

        uint256 totalPrice = sell.price * amount_;

        require(ethBalance[_msgSender()] >= totalPrice, "Not sufficient funds");

        // uint256 sellerValue = (totalPrice * 92) / 100;
        // uint256 ownerValue = (totalPrice * 3) / 100;
        // uint256 artistvalue = (totalPrice * 5) / 100;

        // (bool sentToSeller, ) = sell.seller.call{value: sellerValue}("");
        // (bool sentToOwner, ) = _owner.call{value: ownerValue}("");
        // (bool sentToArtist, ) = creator[contract_].call{value: artistvalue}("");

        // require(sentToSeller, "Failed to send to Seller!");
        // require(sentToOwner, "Failed to send to Owner!");
        // require(sentToArtist, "Failed to send to Artist!");

        // if (msg.value > totalPrice) {
        //     emit receiveExtraEvent(_msgSender(), msg.value - totalPrice);
        // }

        ethBalance[_msgSender()] -= totalPrice;
        ethBalance[sell.seller] += (totalPrice * 92) / 100;
        ethBalance[owner] += (totalPrice * 3) / 100;
        ethBalance[creator[contract_]] += (totalPrice * 5) / 100;

        if (amount_ == sell.amount) {
            delete walletToContractToTokenToProduct[seller_][contract_][id_];
        } else {
            sell.amount -= amount_;
            walletToContractToTokenToProduct[seller_][contract_][id_] = sell;
        }

        I1155(contract_).safeTransferFrom(address(this), _msgSender(), id_, amount_, "0x00");
        emit buyProductEvent(sell.seller, _msgSender(), contract_, id_, amount_, sell.price, totalPrice, msg.value, msg.value - totalPrice);
    }

    // balance enquiry, deposit, withdraw
    function getBalance() external view returns (uint256) {
        return ethBalance[_msgSender()];
    }

    function deposit() public payable returns (uint256 _balance) {
        (bool sent, ) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Failed to deposit");
        ethBalance[_msgSender()] += msg.value;
        emit depositEvent(_msgSender(), msg.value, _balance);
    }

    function withdraw(uint256 value_) public payable returns (uint256 _balance) {
        require(ethBalance[_msgSender()] >= value_, "Not sufficient funds");
        (bool sent, ) = payable(_msgSender()).call{value: value_}("");
        require(sent, "Failed to withdraw");
        ethBalance[_msgSender()] -= value_;
        emit withdrawEvent(_msgSender(), value_, _balance);
    }

    // admin functions
    function adminGetBalance(address operator_) public view onlyOwner returns (uint256) {
        return ethBalance[operator_];
    }

    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function transferOwner(address newOwner_) external onlyOwner {
        owner = newOwner_;
    }

    function adminWithdraw(uint256 value_) external payable onlyOwner returns (uint256) {
        require(address(this).balance >= value_, "Not sufficient funds");
        (bool sent, ) = payable(owner).call{value: value_}("");
        require(sent, "Failed to adminWithDraw");
        emit adminWithdrawEvent(value_, address(this).balance);
        return address(this).balance;
    }

    // private functions
    function _msgSender() private view returns (address) {
        return msg.sender;
    }

    // functions must exist
    receive() external payable {}
}
