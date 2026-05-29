/**
 * simple-storage.ts
 *
 * Contract: SimpleStorage
 * Network:  Base Mainnet (chainId: 8453)
 * Compiler: solc 0.8.17, optimization OFF
 *
 * Solidity source:
 * // SPDX-License-Identifier: MIT
 * pragma solidity ^0.8.17;
 * contract SimpleStorage {
 *     uint256 private storedData;
 *     function set(uint256 x) public { storedData = x; }
 *     function get() public view returns (uint256) { return storedData; }
 * }
 */

export const SIMPLE_STORAGE_BYTECODE =
  "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe" +
  "608060405234801561001057600080fd5b50600436106100365760003560e01c80" +
  "6360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480" +
  "360381019061005091906100c3565b610075565b005b61005f61007f565b604051" +
  "61006c91906100ff565b60405180910390f35b8060008190555050565b60008054" +
  "905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100" +
  "ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000" +
  "602082840312156100d9576100d8610088565b5b60006100e7848285016100ae56" +
  "5b91505092915050565b6100f98161008d565b82525050565b600060208201905061" +
  "011460008301846100f0565b9291505056fea2646970667358221220fb8290c48c" +
  "11907f1e8bf82d77d973ec408960775142f76ad9b80fbc5a563ef364736f6c6343" +
  "0008110033"

export const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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

export const SIMPLE_STORAGE_GAS_LIMIT = 120_000

export const SIMPLE_STORAGE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleStorage {
    uint256 private storedData;

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
  optimizationUsed: false,
  optimizationRuns: 200,
}
export const SIMPLE_STORAGE_DEPLOY_FEE_USD = 0.15
export const SIMPLE_STORAGE_VERIFY_FEE_USD = 0.30