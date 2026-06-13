// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract GMBeacon {
    uint256 public gmCount;
    mapping(address => uint256) public userGmCount;

    event GM(
        address indexed sender,
        uint256 userTotal,
        uint256 globalTotal
    );

    function gm() public {
        gmCount++;
        userGmCount[msg.sender]++;
        emit GM(msg.sender, userGmCount[msg.sender], gmCount);
    }
}