// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IBetTypes.sol";

// by @lyghtcode ;)

contract BasedBets is ReentrancyGuard, Ownable, IBetTypes {
    using SafeMath for uint256;

    mapping(uint256 => Bet) public bets;
    uint256 public betCount;
    uint256 public feeETHBasisPoints;
    uint256 public feeUSDTBasisPoints;
    uint256 public feeUSDCBasisPoints;

    IERC20 public usdtToken;
    IERC20 public usdcToken;

    Side public globalWinner;
    bool public winnerSet;

    int256 public globalOddsSide1;
    int256 public globalOddsSide2;

    bool public eventCancelled;

    event BetCreated(
        uint256 indexed betId,
        address indexed creator,
        uint256 amount,
        string currency,
        Side side,
        int256 oddsSide1,
        int256 oddsSide2,
        bool isPrivate,
        address whitelistedAddr
    );
    event BetMatched(uint256 indexed betId, address indexed matcher, Side side);
    event WinnerDecided(Side winner);
    event WinningsWithdrawn(
        uint256 indexed betId,
        address indexed winner,
        uint256 amount
    );
    event BetCancelled(uint256 indexed betId);
    event FeeUpdated(string currency, uint256 newFee);
    event GlobalOddsUpdated(int256 newOddsSide1, int256 newOddsSide2);
    event EventCancelled();

    modifier onlyValidSide(Side side) {
        require(side == Side.Side1 || side == Side.Side2, "Invalid side");
        _;
    }

    modifier onlyValidCurrency(string memory currency) {
        require(
            keccak256(bytes(currency)) == keccak256("ETH") ||
                keccak256(bytes(currency)) == keccak256("USDT") ||
                keccak256(bytes(currency)) == keccak256("USDC"),
            "Invalid currency"
        );
        _;
    }

    constructor(
        address _usdtTokenAddress,
        address _usdcTokenAddress,
        uint256 _feeETHBasisPoints,
        uint256 _feeUSDTBasisPoints,
        uint256 _feeUSDCBasisPoints,
        int256 _globalOddsSide1,
        int256 _globalOddsSide2
    ) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtTokenAddress);
        usdcToken = IERC20(_usdcTokenAddress);
        feeETHBasisPoints = _feeETHBasisPoints;
        feeUSDTBasisPoints = _feeUSDTBasisPoints;
        feeUSDCBasisPoints = _feeUSDCBasisPoints;
        globalOddsSide1 = _globalOddsSide1;
        globalOddsSide2 = _globalOddsSide2;
    }

    function cancelEvent() external onlyOwner {
        eventCancelled = true;
        emit EventCancelled();
    }

    function createBet(
        uint256 amount,
        string memory currency,
        Side side,
        int256 oddsSide1,
        int256 oddsSide2,
        bool isPrivate,
        address whitelistedAddr
    )
        external
        payable
        onlyValidSide(side)
        onlyValidCurrency(currency)
        nonReentrant
    {
        // Prevent new bets if a winner has already been decided
        require(
            !winnerSet,
            "Cannot create new bets after the winner has been decided"
        );
        // Handle currency transfer
        handleCurrencyTransfer(amount, currency);

        // Set default odds if not provided
        (int256 finalOddsSide1, int256 finalOddsSide2) = setDefaultOdds(
            oddsSide1,
            oddsSide2
        );

        // Create the bet
        createNewBet(
            amount,
            currency,
            side,
            finalOddsSide1,
            finalOddsSide2,
            isPrivate,
            whitelistedAddr
        );
    }

    function handleCurrencyTransfer(
        uint256 amount,
        string memory currency
    ) internal {
        bytes32 currencyHash = keccak256(bytes(currency));
        if (currencyHash == keccak256("ETH")) {
            require(
                msg.value == amount,
                "Must deposit the betting amount in ETH"
            );
        } else if (currencyHash == keccak256("USDT")) {
            require(
                usdtToken.transferFrom(msg.sender, address(this), amount),
                "USDT transfer failed"
            );
        } else if (currencyHash == keccak256("USDC")) {
            require(
                usdcToken.transferFrom(msg.sender, address(this), amount),
                "USDC transfer failed"
            );
        }
    }

    function setDefaultOdds(
        int256 oddsSide1,
        int256 oddsSide2
    ) internal view returns (int256, int256) {
        if (oddsSide1 == 0 && oddsSide2 == 0) {
            return (globalOddsSide1, globalOddsSide2);
        }
        return (oddsSide1, oddsSide2);
    }

    function createNewBet(
        uint256 amount,
        string memory currency,
        Side side,
        int256 oddsSide1,
        int256 oddsSide2,
        bool isPrivate,
        address whitelistedAddr
    ) internal {
        Bet storage newBet = bets[betCount];
        newBet.id = betCount;
        newBet.addr1 = payable(msg.sender);
        newBet.addr2 = payable(address(0));
        newBet.amount = amount;
        newBet.matched = false;
        newBet.winner = Side.None;
        newBet.withdrawn = false;
        newBet.side = side;
        newBet.currency = currency;
        newBet.createdAt = block.timestamp;
        newBet.oddsSide1 = oddsSide1;
        newBet.oddsSide2 = oddsSide2;
        newBet.isPrivate = isPrivate;
        newBet.whitelistedAddr = whitelistedAddr;
        newBet.cancelled = false;

        emit BetCreated(
            betCount,
            msg.sender,
            amount,
            currency,
            side,
            oddsSide1,
            oddsSide2,
            isPrivate,
            whitelistedAddr
        );
        betCount++;
    }

    function matchBet(
        uint256 betId,
        Side side
    ) external payable onlyValidSide(side) nonReentrant {
        Bet storage bet = bets[betId];
        require(!bet.matched, "Bet is already matched");
        require(bet.addr1 != msg.sender, "Cannot match your own bet");
        require(side != bet.side, "Cannot bet on the same side");

        if (bet.isPrivate) {
            require(
                msg.sender == bet.whitelistedAddr,
                "You are not whitelisted to match this bet"
            );
        }

        // Remove the calculation of required amount
        // uint256 requiredAmount = bet.amount;

        if (keccak256(bytes(bet.currency)) == keccak256("ETH")) {
            require(msg.value > 0, "Must deposit a positive amount in ETH");
        } else if (keccak256(bytes(bet.currency)) == keccak256("USDT")) {
            require(
                usdtToken.transferFrom(msg.sender, address(this), msg.value),
                "USDT transfer failed"
            );
        } else if (keccak256(bytes(bet.currency)) == keccak256("USDC")) {
            require(
                usdcToken.transferFrom(msg.sender, address(this), msg.value),
                "USDC transfer failed"
            );
        }

        bet.addr2 = payable(msg.sender);
        bet.matched = true;

        emit BetMatched(betId, msg.sender, side);
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function decideWinner(Side winner) external onlyOwner {
        require(
            winner == Side.Side1 || winner == Side.Side2,
            "Invalid winner side"
        );

        globalWinner = winner;
        winnerSet = true;

        // Update the winner for all matched bets
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].matched && !bets[i].withdrawn) {
                bets[i].winner = winner;
            }
        }

        emit WinnerDecided(winner);
    }

    function calculateWinnings(
        uint256 betAmount,
        int256 odds
    ) internal pure returns (uint256) {
        if (odds > 0) {
            return betAmount.mul(uint256(odds)).div(100).add(betAmount);
        } else {
            return betAmount.mul(100).div(uint256(-odds)).add(betAmount);
        }
    }

    function calculateFee(
        uint256 amount,
        uint256 feeBasisPoints
    ) internal pure returns (uint256) {
        return amount.mul(feeBasisPoints).div(10000);
    }

    function withdrawWinnings(uint256 betId) external nonReentrant {
        Bet storage bet = bets[betId];
        require(bet.matched, "Bet is not matched yet");
        require(
            winnerSet || eventCancelled,
            "Winner not decided or event not cancelled yet"
        );
        require(!bet.withdrawn, "Winnings already withdrawn");
        require(
            bet.winner != Side.None || eventCancelled,
            "No winner for this bet"
        );

        address payable winner;
        uint256 winningAmount;

        if (eventCancelled) {
            (winner, winningAmount) = handleEventCancelled(bet);
        } else {
            (winner, winningAmount) = handleEventNotCancelled(bet);
        }

        bet.withdrawn = true;
        transferWinnings(winner, winningAmount, bet.currency);

        emit WinningsWithdrawn(betId, winner, winningAmount);
    }

    function handleEventCancelled(
        Bet storage bet
    ) internal view returns (address payable, uint256) {
        if (msg.sender == bet.addr1) {
            return (bet.addr1, bet.amount);
        } else if (msg.sender == bet.addr2) {
            return (bet.addr2, bet.amount);
        } else {
            revert("Only participants can withdraw");
        }
    }

    function handleEventNotCancelled(
        Bet storage bet
    ) internal view returns (address payable, uint256) {
        address payable winner;
        uint256 winningAmount;

        if (bet.side == globalWinner) {
            winner = bet.addr1;
            winningAmount = calculateWinnings(bet.amount, bet.oddsSide1);
        } else {
            winner = bet.addr2;
            winningAmount = calculateWinnings(bet.amount, bet.oddsSide2);
        }

        uint256 fee = calculateFee(
            winningAmount,
            getFeeBasisPoints(bet.currency)
        );
        winningAmount = winningAmount.sub(fee);

        return (winner, winningAmount);
    }

    function getFeeBasisPoints(
        string memory currency
    ) internal view returns (uint256) {
        if (keccak256(bytes(currency)) == keccak256("ETH")) {
            return feeETHBasisPoints;
        } else if (keccak256(bytes(currency)) == keccak256("USDT")) {
            return feeUSDTBasisPoints;
        } else if (keccak256(bytes(currency)) == keccak256("USDC")) {
            return feeUSDCBasisPoints;
        } else {
            revert("Invalid currency");
        }
    }

    function transferWinnings(
        address payable winner,
        uint256 amount,
        string memory currency
    ) internal {
        if (keccak256(bytes(currency)) == keccak256("ETH")) {
            winner.transfer(amount);
        } else if (keccak256(bytes(currency)) == keccak256("USDT")) {
            require(usdtToken.transfer(winner, amount), "USDT transfer failed");
        } else if (keccak256(bytes(currency)) == keccak256("USDC")) {
            require(usdcToken.transfer(winner, amount), "USDC transfer failed");
        }
    }

    function cancelBet(uint256 betId) external nonReentrant {
        Bet storage bet = bets[betId];
        require(bet.addr1 == msg.sender, "Only the creator can cancel the bet");
        require(!bet.matched, "Cannot cancel a matched bet");

        if (keccak256(bytes(bet.currency)) == keccak256("ETH")) {
            bet.addr1.transfer(bet.amount);
        } else if (keccak256(bytes(bet.currency)) == keccak256("USDT")) {
            require(
                usdtToken.transfer(bet.addr1, bet.amount),
                "USDT transfer failed"
            );
        } else if (keccak256(bytes(bet.currency)) == keccak256("USDC")) {
            require(
                usdcToken.transfer(bet.addr1, bet.amount),
                "USDC transfer failed"
            );
        }

        bet.cancelled = true;

        emit BetCancelled(betId);
        delete bets[betId];
    }

    // Admin functions to update fees and global odds
    function updateFeeETH(uint256 newFee) external onlyOwner {
        feeETHBasisPoints = newFee;
        emit FeeUpdated("ETH", newFee);
    }

    function updateFeeUSDT(uint256 newFee) external onlyOwner {
        feeUSDTBasisPoints = newFee;
        emit FeeUpdated("USDT", newFee);
    }

    function updateFeeUSDC(uint256 newFee) external onlyOwner {
        feeUSDCBasisPoints = newFee;
        emit FeeUpdated("USDC", newFee);
    }

    function updateGlobalOdds(
        int256 newOddsSide1,
        int256 newOddsSide2
    ) external onlyOwner {
        globalOddsSide1 = newOddsSide1;
        globalOddsSide2 = newOddsSide2;
        emit GlobalOddsUpdated(newOddsSide1, newOddsSide2);
    }

    // Read functions
    function getOpenBets() external view returns (Bet[] memory) {
        uint256 openBetCount = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (!bets[i].matched && !bets[i].cancelled) {
                // Skip cancelled bets
                openBetCount++;
            }
        }

        Bet[] memory openBets = new Bet[](openBetCount);
        uint256 index = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (!bets[i].matched && !bets[i].cancelled) {
                // Skip cancelled bets
                openBets[index] = bets[i];
                index++;
            }
        }
        return openBets;
    }

    function getMatchedBets() external view returns (Bet[] memory) {
        uint256 matchedBetCount = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].matched) {
                matchedBetCount++;
            }
        }

        Bet[] memory matchedBets = new Bet[](matchedBetCount);
        uint256 index = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].matched) {
                matchedBets[index] = bets[i];
                index++;
            }
        }
        return matchedBets;
    }

    function getTotalWageredByCurrency(
        string memory currency
    ) external view returns (uint256) {
        uint256 totalWagered = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (
                keccak256(bytes(bets[i].currency)) == keccak256(bytes(currency))
            ) {
                totalWagered = totalWagered.add(bets[i].amount);
            }
        }
        return totalWagered;
    }

    function getTotalWageredBySide(Side side) external view returns (uint256) {
        uint256 totalWagered = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].side == side) {
                totalWagered = totalWagered.add(bets[i].amount);
            }
        }
        return totalWagered;
    }

    function getTotalWageredOpen() external view returns (uint256) {
        uint256 totalWageredOpen = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (!bets[i].matched) {
                totalWageredOpen = totalWageredOpen.add(bets[i].amount);
            }
        }
        return totalWageredOpen;
    }

    function getUserBets(address user) external view returns (Bet[] memory) {
        uint256 userBetCount = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].addr1 == user || bets[i].addr2 == user) {
                userBetCount++;
            }
        }

        Bet[] memory userBets = new Bet[](userBetCount);

        uint256 index = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].addr1 == user || bets[i].addr2 == user) {
                userBets[index] = bets[i];
                index++;
            }
        }
        return userBets;
    }

    function getPrivateBets(address user) external view returns (Bet[] memory) {
        uint256 privateBetCount = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].isPrivate && bets[i].whitelistedAddr == user) {
                privateBetCount++;
            }
        }

        Bet[] memory privateBets = new Bet[](privateBetCount);
        uint256 index = 0;
        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].isPrivate && bets[i].whitelistedAddr == user) {
                privateBets[index] = bets[i];
                index++;
            }
        }
        return privateBets;
    }

    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
}
