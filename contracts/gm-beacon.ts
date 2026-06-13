// ─────────────────────────────────────────────────────────────────────────────
// GM Beacon — compiled with solc 0.8.35+commit.47b9dedd  |  evmVersion: london
// Optimization: ON — runs: 200
// No constructor — no name prompt, no constructor args, pure deployment
// Both Deploy and Deploy & Verify are completely FREE (no treasury fee)
// ─────────────────────────────────────────────────────────────────────────────

export const GM_BEACON_BYTECODE =
  "0x6080604052348015600f57600080fd5b5061019f8061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80636cb5f71014610046578063c0129d4314610061578063c9d5a9eb1461006b575b600080fd5b61004f60005481565b60405190815260200160405180910390f35b61006961008b565b005b61004f610079366004610112565b60016020526000908152604090205481565b60008054908061009a83610142565b90915550503360009081526001602052604081208054916100ba83610142565b90915550503360008181526001602052604080822054915490517f7ee98e33fca8a7760214caad862e1a72f20c4561e6d9be2fdb1dbf558af93eb19261010892908252602082015260400190565b60405180910390a2565b60006020828403121561012457600080fd5b81356001600160a01b038116811461013b57600080fd5b9392505050565b60006001820161016257634e487b7160e01b600052601160045260246000fd5b506001019056fea26469706673582212200f1872005be1834a1293e777119f4933cdc6b3f8c8dce88b2c87cbca8e44587e64736f6c63430008230033"

export const GM_BEACON_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userTotal",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "globalTotal",
        type: "uint256",
      },
    ],
    name: "GM",
    type: "event",
  },
  {
    inputs: [],
    name: "gm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gmCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userGmCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export const GM_BEACON_GAS_LIMIT = 200_000

export const GM_BEACON_SOURCE = `// SPDX-License-Identifier: MIT
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
}`

export const GM_BEACON_COMPILER = {
  name: "GMBeacon",
  version: "v0.8.35+commit.47b9dedd",
  optimizationUsed: true,
  optimizationRuns: 200,
  evmVersion: "london",
}

export const GM_BEACON_DEPLOY_FEE_USD = 0
export const GM_BEACON_VERIFY_FEE_USD = 0