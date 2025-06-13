// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Wallet {
    address public owner;
    constructor(address _owner) {
        owner = _owner;
    }
    
    event Received(address indexed sender, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(address payable to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount <= address(this).balance, "Insufficient contract balance");

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit Withdraw(to, amount);
    }
}