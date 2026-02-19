// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EnergyTrading.sol";

contract DeployEnergyTrading is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EnergyTrading energy = new EnergyTrading();

        vm.stopBroadcast();
    }
}
