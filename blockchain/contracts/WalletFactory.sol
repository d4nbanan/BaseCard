// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './Wallet.sol';

contract WalletFactory {
    event WalletCreated(address indexed owner, address wallet);

    function createWallet() external returns (address) {
        Wallet wallet = new Wallet(msg.sender);
        emit WalletCreated(msg.sender, address(wallet));
        return address(wallet);
    }
}