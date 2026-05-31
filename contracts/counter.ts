// contracts/counter.ts
//
// Contract: Counter
// Network:  Base Mainnet (chainId: 8453)
// Compiler: solc 0.8.23+commit.f704f362
// Optimization: ON — runs: 200
// EVM Version: london
//
// What it does:
//   - Stores a number on-chain (starts at 0)
//   - increment() → adds 1
//   - decrement() → subtracts 1 (stops at 0, never goes negative)
//   - reset()     → owner only, sets back to 0
//   - Emits CounterChanged event on every state change

export const COUNTER_BYTECODE =
  "0x60c0604052348015600f57600080fd5b50336080524260a05260805160a0516102d7610042600039600060e1015260008181609a01526101c301526102d76000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806306661abd146100675780632baeceb714610083578063d09de08a1461008d578063d5f3948814610095578063d826f88f146100d4578063eae4c19f146100dc575b600080fd5b61007060005481565b6040519081526020015b60405180910390f35b61008b610103565b005b61008b6101a6565b6100bc7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161007a565b61008b6101b8565b6100707f000000000000000000000000000000000000000000000000000000000000000081565b60008054116101515760405162461bcd60e51b8152602060048201526015602482015274436f756e7465723a20616c7265616479207a65726f60581b60448201526064015b60405180910390fd5b60016000808282546101639190610275565b9091555050600054604080519182523360208301527fa0e2d152c0e292afeb54356a83198ea2d5de4fbc6e932155f681bed044c3930291015b60405180910390a1565b6001600080828254610163919061028e565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146102255760405162461bcd60e51b815260206004820152601260248201527121b7bab73a32b91d103737ba1037bbb732b960711b6044820152606401610148565b6000808055604080519182523360208301527fa0e2d152c0e292afeb54356a83198ea2d5de4fbc6e932155f681bed044c39302910161019c565b634e487b7160e01b600052601160045260246000fd5b818103818111156102885761028861025f565b92915050565b808201808211156102885761028861025f56fea26469706673582212202fb71eae8d32d631354123231046625f6e77333bedbcc7fabcdb6a49ce0b9a2164736f6c63430008230033"

export const COUNTER_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "changedBy",
        type: "address",
      },
    ],
    name: "CounterChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "count",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

// ─── GAS LIMIT ───────────────────────────────────────────────────────────────
export const COUNTER_GAS_LIMIT = 145_000

// ─── SOLIDITY SOURCE ─────────────────────────────────────────────────────────
// Must match EXACTLY what was compiled above — character for character
export const COUNTER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Counter {
    uint256 public count;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event CounterChanged(uint256 newValue, address changedBy);

    constructor() {
        deployer   = msg.sender;
        deployedAt = block.timestamp;
    }

    function increment() public {
        count += 1;
        emit CounterChanged(count, msg.sender);
    }

    function decrement() public {
        require(count > 0, "Counter: already zero");
        count -= 1;
        emit CounterChanged(count, msg.sender);
    }

    function reset() public {
        require(msg.sender == deployer, "Counter: not owner");
        count = 0;
        emit CounterChanged(0, msg.sender);
    }
}`

// ─── COMPILER SETTINGS ───────────────────────────────────────────────────────
// CRITICAL: version must match exactly what compiled the bytecode above
export const COUNTER_COMPILER = {
  name: "Counter",
  version: "v0.8.23+commit.f704f362",
  optimizationUsed: true,
  optimizationRuns: 200,
  evmVersion: "london",
}

// ─── FEE CONSTANTS ───────────────────────────────────────────────────────────
export const COUNTER_DEPLOY_FEE_USD = 0.15
export const COUNTER_VERIFY_FEE_USD = 0.30