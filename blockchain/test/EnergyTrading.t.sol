// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EnergyTrading.sol";

contract EnergyTradingTest is Test {
    EnergyTrading public energy;
    address public producer = address(1);
    address public consumer = address(2);

    function setUp() public {
        energy = new EnergyTrading();
    }

    function testRegisterProducer() public {
        vm.prank(producer);
        energy.registerUser("Ravi", EnergyTrading.Role.Producer);
        
        (string memory name, EnergyTrading.Role role, bool registered) = energy.users(producer);
        assertEq(name, "Ravi");
        assertEq(uint(role), uint(EnergyTrading.Role.Producer));
        assertTrue(registered);
        
        (address p, , , ) = energy.grid();
        assertEq(p, producer);
    }

    function testRegisterConsumer() public {
        vm.prank(consumer);
        energy.registerUser("Priya", EnergyTrading.Role.Consumer);
        
        (string memory name, EnergyTrading.Role role, bool registered) = energy.users(consumer);
        assertEq(name, "Priya");
        assertEq(uint(role), uint(EnergyTrading.Role.Consumer));
        assertTrue(registered);
    }

    function testFeedGrid() public {
        vm.prank(producer);
        energy.registerUser("Ravi", EnergyTrading.Role.Producer);

        vm.prank(producer);
        energy.feedGrid(1000, 100); // 1000 Wh, 100 wei/Wh

        (, uint256 supply, uint256 price, ) = energy.grid();
        assertEq(supply, 1000);
        assertEq(price, 100);
    }

    function testBuyFromGrid() public {
        // Setup producer and grid
        vm.prank(producer);
        energy.registerUser("Ravi", EnergyTrading.Role.Producer);
        vm.prank(producer);
        energy.feedGrid(1000, 100);

        // Setup consumer
        vm.prank(consumer);
        energy.registerUser("Priya", EnergyTrading.Role.Consumer);
        vm.deal(consumer, 200000); // Give consumer some ETH

        // Buy energy (200 Wh * 120 wei/Wh = 24000 wei)
        vm.prank(consumer);
        energy.buyFromGrid{value: 24000}(200);

        (, uint256 supply, , ) = energy.grid();
        assertEq(supply, 800);
        assertEq(address(producer).balance, 24000);
        assertEq(energy.totalEnergyTraded(), 200);
    }

    function testDynamicPrice() public {
        vm.prank(producer);
        energy.registerUser("Ravi", EnergyTrading.Role.Producer);
        
        // Supply = 9000 Wh (< 10kWh)
        vm.prank(producer);
        energy.feedGrid(9000, 100);

        uint256 price = energy.getDynamicPrice();
        assertEq(price, 120); // 20% increase
    }
}
