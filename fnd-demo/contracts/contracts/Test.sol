// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Test {
    function balanceOf(address from_) external view returns (uint256) {
        return from_.balance;
    }

    function sendViaTransfer(address payable to_, uint256 value_) external payable {
        to_.transfer(value_);
    }

    function sendViaSend(address payable to_, uint256 value_) external payable {
        bool sent = to_.send(value_);
        require(sent, "Send Failed");
    }

    function sendViaCall(address to_, uint256 value_) external payable {
        (bool sent, ) = to_.call{value: value_}("");
        require(sent, "Call Failed");
    }
}
