/**
 * simple-storage.ts
 *
 * Contract: SimpleStorage
 * Network:  Base Mainnet (chainId: 8453)
 * Compiler: solc 0.8.17, optimization ON, runs 200
 * EVM:      default (london)
 *
 * Immutables:
 *   - deployer   → msg.sender baked into bytecode (unique per user)
 *   - deployedAt → block.timestamp baked into bytecode (unique per block)
 *
 * This makes every deployment bytecode unique.
 * No two users share the same bytecode on BaseScan.
 */

export const SIMPLE_STORAGE_BYTECODE =
  "0x60c060405234801561001057600080fd5b50336080524260a05260805160a051" +
  "6101256100386000396000" +
  "60b501526000607801526101256000f3fe6080604052348015600f57600080fd5b" +
  "506004361060465760003560e01c806360fe47b114604b5780636d4ce63c14605d" +
  "578063d5f39488146074578063eae4c19f1460b1575b600080fd5b605b60563660" +
  "0460d7565b600055565b005b6000545b6040519081526020015b60405180910390" +
  "f35b609a7f00000000000000000000000000000000000000000000000000000000" +
  "0000000081565b6040516001600160a01b039091168152602001606b565b60617f" +
  "0000000000000000000000000000000000000000000000000000000000000000" +
  "81565b60006020828403121560e857600080fd5b503591905056fea264697066" +
  "7358221220699d897b4ecaf2ab7fd9cc7b497b11accacdebaa733a139f13a2b8" +
  "bf910f274c64736f6c63430008110033"

export const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "deployedAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deployer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "x", type: "uint256" }],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export const SIMPLE_STORAGE_GAS_LIMIT = 150_000

export const SIMPLE_STORAGE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleStorage {
    uint256 private storedData;

    address public immutable deployer;
    uint256 public immutable deployedAt;

    constructor() {
        deployer   = msg.sender;
        deployedAt = block.timestamp;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}`

export const SIMPLE_STORAGE_COMPILER = {
  name: "SimpleStorage",
  version: "v0.8.17+commit.8df45f5f",
  optimizationUsed: true,
  optimizationRuns: 200,
}

export const SIMPLE_STORAGE_DEPLOY_FEE_USD = 0.15
export const SIMPLE_STORAGE_VERIFY_FEE_USD = 0.30