// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function decimals() external view returns (uint8);
}

contract CardBase {
    IERC20 public usdc;

    constructor(address _owner, address _usdc) {
        owner = _owner;
        usdc = IERC20(_usdc);
    }

    uint256 public constant CARD_ISSUE_FEE = 1 * 1e6;

    address public owner;
    struct Card {
        string id;
        CardStatus status;
        uint64 balance;
    }
    enum CardStatus {
        Active,
        Frozen
    }

    mapping (address => Card) cardsMap;

    event CardIssued(address indexed user, string cardId);

    function issueCard(string memory cardId) external {
        require(bytes(cardsMap[msg.sender].id).length == 0, "Card already issued for this address");

        require(usdc.transferFrom(msg.sender, address(this), CARD_ISSUE_FEE), "USDC transfer failed");

        cardsMap[msg.sender] = Card({id: cardId, status: CardStatus.Active, balance: 0 });
        emit CardIssued(msg.sender, cardId);
    }

    function getCard(address cardOwner) external view returns (string memory, CardStatus, uint64) {
        Card storage card = cardsMap[cardOwner];
        return (card.id, card.status, card.balance);
    }
}