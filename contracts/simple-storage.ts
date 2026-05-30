/**
 * simple-storage.ts
 *
 * Contract: SimpleStorage
 * Network:  Base Mainnet (chainId: 8453)
 * Compiler: solc 0.8.17+commit.8df45f5f
 * Optimization: ON — runs: 200
 * EVM Version: default
 *
 * Immutables:
 *   - deployer   → msg.sender (unique per user)
 *   - deployedAt → block.timestamp (unique per block)
 */

export const SIMPLE_STORAGE_BYTECODE = "0x60c060405234801561001057600080fd5b50336080524260a05260805160a05161012561003c600039600060b501526000607801526101256000f3fe6080604052348015600f57600080fd5b506004361060465760003560e01c806360fe47b114604b5780636d4ce63c14605d578063d5f39488146074578063eae4c19f1460b1575b600080fd5b605b605636600460d7565b600055565b005b6000545b6040519081526020015b60405180910390f35b609a7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001606b565b60617f000000000000000000000000000000000000000000000000000000000000000081565b60006020828403121560e857600080fd5b503591905056fea26469706673582212201a4c3b0ad5beb6cf6c3832965f82d27f76e2639a690f52dcadbecdbc9368880864736f6c63430008110033"

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