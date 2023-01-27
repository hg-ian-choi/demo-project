// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Fund {
    address owner;
    mapping(address => uint256) balance;
    mapping(string => bool) id;

    constructor() {
        owner = msg.sender;
    }

    event depositEvent(string indexed id, address indexed operator, uint256 value, uint256 balance);

    event withdrawEvent(string indexed id, address indexed operator, uint256 value, uint256 balance);

    function deposit(string memory id_) public payable {
        require(msg.value > 0, "Not value sent");
        (bool sent, ) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Fail to deposit");
        balance[msg.sender] = balance[msg.sender] + msg.value;
        emit depositEvent(id_, msg.sender, msg.value, balance[msg.sender]);
    }

    function withdraw(string memory id_, uint256 value_) public payable {
        require(balance[msg.sender] >= value_, "Not sufficient funds");
        (bool sent, ) = payable(msg.sender).call{value: value_}("");
        require(sent, "Fail to withdraw");
        balance[msg.sender] = balance[msg.sender] - value_;
        emit withdrawEvent(id_, msg.sender, value_, balance[msg.sender]);
    }

    function getBalance() public view returns (uint256) {
        return balance[msg.sender];
    }

    function getFundBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    receive() external payable {}
}
