// scripts/gen-lucky-block.js
const solc = require("solc")
const fs   = require("fs")
const path = require("path")

const SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract LuckyBlock {
    mapping(address => uint256) public luckyNumbers;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event LuckyNumberSet(address indexed user, uint256 number);

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
        deployedAt = block.timestamp;
    }

    function setLuckyNumber(uint256 number) public {
        luckyNumbers[msg.sender] = number;
        emit LuckyNumberSet(msg.sender, number);
    }

    function getMyLuckyNumber() public view returns (uint256) {
        return luckyNumbers[msg.sender];
    }

    function getLuckyNumber(address user) public view returns (uint256) {
        return luckyNumbers[user];
    }
}`

const input = {
  language: "Solidity",
  sources: { "LuckyBlock.sol": { content: SOURCE } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "london",
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))

if (output.errors) {
  const errors = output.errors.filter((e) => e.severity === "error")
  if (errors.length > 0) {
    errors.forEach((e) => console.error(e.formattedMessage))
    process.exit(1)
  }
}

const contract  = output.contracts["LuckyBlock.sol"]["LuckyBlock"]
const bytecode  = "0x" + contract.evm.bytecode.object
const abi       = contract.abi
const version   = "v" + solc.version().replace(".Emscripten.clang", "")

console.log("Compiler:", version)
console.log("Bytecode length:", bytecode.length)

const fileContent = `/**
 * contracts/lucky-block.ts
 * Contract:    LuckyBlock
 * Network:     Base Mainnet (chainId: 8453)
 * Compiler:    solc ${version}
 * Optimization: ON — runs: 200
 * EVM Version: london
 * Constructor: string memory _name (makes every deployment unique)
 */

export const LUCKY_BLOCK_BYTECODE =
  "${bytecode}"

export const LUCKY_BLOCK_ABI = ${JSON.stringify(abi, null, 2)} as const

export const LUCKY_BLOCK_GAS_LIMIT = 220_000

export const LUCKY_BLOCK_SOURCE = \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract LuckyBlock {
    mapping(address => uint256) public luckyNumbers;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event LuckyNumberSet(address indexed user, uint256 number);

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
        deployedAt = block.timestamp;
    }

    function setLuckyNumber(uint256 number) public {
        luckyNumbers[msg.sender] = number;
        emit LuckyNumberSet(msg.sender, number);
    }

    function getMyLuckyNumber() public view returns (uint256) {
        return luckyNumbers[msg.sender];
    }

    function getLuckyNumber(address user) public view returns (uint256) {
        return luckyNumbers[user];
    }
}\`

export const LUCKY_BLOCK_COMPILER = {
  name: "LuckyBlock",
  version: "${version}",
  optimizationUsed: true,
  optimizationRuns: 200,
  evmVersion: "london",
}

export const LUCKY_BLOCK_DEPLOY_FEE_USD = 0.09
export const LUCKY_BLOCK_VERIFY_FEE_USD = 0.09
`

const outPath = path.join(__dirname, "..", "contracts", "lucky-block.ts")
fs.writeFileSync(outPath, fileContent, "utf8")
console.log("✅ contracts/lucky-block.ts written successfully!")