// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EnergyTrading
 * @dev Implements a decentralized energy grid where a single producer feeds surplus
 * solar energy, and consumers buy it. Payments go directly to the producer.
 */
contract EnergyTrading {
    enum Role { Producer, Consumer }

    struct User {
        string name;
        Role role;
        bool isRegistered;
    }

    struct Grid {
        address producer;        // The one producer's wallet
        uint256 totalSupply;     // Wh available in the grid
        uint256 pricePerUnit;    // wei per Wh (base price)
        uint256 lastUpdated;
    }

    struct Trade {
        uint256 id;
        address buyer;           // Consumer who bought
        address producer;        // Producer who gets paid
        uint256 energyAmount;    // Wh purchased
        uint256 totalPrice;      // Total wei paid
        uint256 timestamp;
    }

    Grid public grid;
    mapping(address => User) public users;
    Trade[] public trades;

    uint256 public totalEnergyTraded;
    uint256 public totalTransactions;
    address public contractOwner;

    // Events
    event UserRegistered(address indexed user, string name, Role role);
    event GridFed(address indexed producer, uint256 amount, uint256 pricePerUnit);
    event EnergyPurchased(uint256 indexed tradeId, address indexed buyer, address indexed producer, uint256 amount, uint256 price);

    constructor() {
        contractOwner = msg.sender;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyProducer() {
        require(users[msg.sender].role == Role.Producer, "Only producer can perform this");
        _;
    }

    /**
     * @dev Register a new user with a name and role.
     */
    function registerUser(string memory _name, Role _role) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        
        if (_role == Role.Producer) {
            require(grid.producer == address(0), "Producer already exists for this grid");
            grid.producer = msg.sender;
        }

        users[msg.sender] = User({
            name: _name,
            role: _role,
            isRegistered: true
        });

        emit UserRegistered(msg.sender, _name, _role);
    }

    /**
     * @dev Producer feeds energy into the grid.
     * @param _amount Energy in Wh.
     * @param _pricePerUnit Price in wei per Wh.
     */
    function feedGrid(uint256 _amount, uint256 _pricePerUnit) external onlyRegistered onlyProducer {
        grid.totalSupply += _amount;
        grid.pricePerUnit = _pricePerUnit;
        grid.lastUpdated = block.timestamp;

        emit GridFed(msg.sender, _amount, _pricePerUnit);
    }

    /**
     * @dev Consumer buys energy from the grid.
     * @param _amount Energy in Wh to buy.
     */
    function buyFromGrid(uint256 _amount) external payable onlyRegistered {
        require(users[msg.sender].role == Role.Consumer, "Only consumers can buy");
        
        uint256 currentPrice = getDynamicPrice();
        uint256 totalCost = _amount * currentPrice;

        require(msg.value >= totalCost, "Insufficient payment sent");
        require(grid.totalSupply >= _amount, "Not enough energy in grid");

        // Deduct from grid supply
        grid.totalSupply -= _amount;

        // Pay the producer
        (bool sent, ) = payable(grid.producer).call{value: msg.value}("");
        require(sent, "Failed to send ETH to producer");

        // Record trade
        uint256 tradeId = trades.length;
        trades.push(Trade({
            id: tradeId,
            buyer: msg.sender,
            producer: grid.producer,
            energyAmount: _amount,
            totalPrice: msg.value,
            timestamp: block.timestamp
        }));

        totalEnergyTraded += _amount;
        totalTransactions++;

        emit EnergyPurchased(tradeId, msg.sender, grid.producer, _amount, currentPrice);
    }

    /**
     * @dev Simple dynamic pricing logic based on grid supply.
     */
    function getDynamicPrice() public view returns (uint256) {
        if (grid.totalSupply == 0) return grid.pricePerUnit;
        
        // Example: if supply is low, increase price. 
        if (grid.totalSupply < 10000) { // < 10kWh
            return (grid.pricePerUnit * 120) / 100;
        } else if (grid.totalSupply < 50000) { // < 50kWh
            return (grid.pricePerUnit * 110) / 100;
        }
        
        return grid.pricePerUnit;
    }

    function getGridStatus() external view returns (Grid memory) {
        return grid;
    }

    function getUserTrades(address _user) external view returns (Trade[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < trades.length; i++) {
            if (trades[i].buyer == _user || trades[i].producer == _user) {
                count++;
            }
        }

        Trade[] memory userTrades = new Trade[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < trades.length; i++) {
            if (trades[i].buyer == _user || trades[i].producer == _user) {
                userTrades[index] = trades[i];
                index++;
            }
        }
        return userTrades;
    }
}
