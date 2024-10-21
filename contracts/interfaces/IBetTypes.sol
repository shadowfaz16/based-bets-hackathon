// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IBetTypes {
    enum Side { None, Side1, Side2 }

    struct Bet {
        uint256 id;
        address payable addr1;
        address payable addr2;
        uint256 amount;
        bool matched;
        Side winner;
        bool withdrawn;
        Side side;
        string currency;
        uint256 createdAt;
        int256 oddsSide1;
        int256 oddsSide2;
        bool isPrivate;
        address whitelistedAddr;
        bool cancelled;
    }
}