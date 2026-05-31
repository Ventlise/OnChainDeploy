// scripts/compile-contracts.js
// Run with: node scripts/compile-contracts.js
// This compiles Counter and Voting and prints their bytecode + ABI

const solc = require("solc")

// ─── CONTRACT SOURCES ────────────────────────────────────────────────────────

const COUNTER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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

const VOTING_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    address public immutable deployer;
    uint256 public immutable deployedAt;

    Proposal[] public proposals;
    uint256 public proposalCount;

    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter);

    constructor() {
        deployer   = msg.sender;
        deployedAt = block.timestamp;
    }

    function createProposal(string calldata description) public {
        require(msg.sender == deployer, "Voting: not owner");
        proposals.push(Proposal({ description: description, voteCount: 0 }));
        emit ProposalCreated(proposalCount, description);
        proposalCount++;
    }

    function vote(uint256 proposalId) public {
        require(proposalId < proposalCount, "Voting: invalid proposal");
        require(!hasVoted[proposalId][msg.sender], "Voting: already voted");
        hasVoted[proposalId][msg.sender] = true;
        proposals[proposalId].voteCount += 1;
        emit VoteCast(proposalId, msg.sender);
    }

    function getVoteCount(uint256 proposalId) public view returns (uint256) {
        require(proposalId < proposalCount, "Voting: invalid proposal");
        return proposals[proposalId].voteCount;
    }

    function getProposal(uint256 proposalId) public view returns (string memory) {
        require(proposalId < proposalCount, "Voting: invalid proposal");
        return proposals[proposalId].description;
    }
}`

// ─── COMPILE FUNCTION ────────────────────────────────────────────────────────

function compile(contractName, source) {
  const input = {
    language: "Solidity",
    sources: {
      [`${contractName}.sol`]: { content: source },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "london",
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode.object"] },
      },
    },
  }

  const output = JSON.parse(solc.compile(JSON.stringify(input)))

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === "error")
    if (errors.length > 0) {
      console.error(`\n❌ Compile errors for ${contractName}:`)
      errors.forEach((e) => console.error(e.formattedMessage))
      process.exit(1)
    }
  }

  const contract = output.contracts[`${contractName}.sol`][contractName]
  return {
    bytecode: "0x" + contract.evm.bytecode.object,
    abi: contract.abi,
  }
}

// ─── COMPILE BOTH ────────────────────────────────────────────────────────────

console.log("\n🔨 Compiling contracts with solc 0.8.x ...\n")

const counter = compile("Counter", COUNTER_SOURCE)
const voting  = compile("Voting",  VOTING_SOURCE)

// ─── PRINT RESULTS ───────────────────────────────────────────────────────────

console.log("═══════════════════════════════════════════════════════")
console.log("✅  COUNTER — Copy these values into contracts/counter.ts")
console.log("═══════════════════════════════════════════════════════")
console.log("\nexport const COUNTER_BYTECODE =")
console.log(`  "${counter.bytecode}"`)
console.log("\nexport const COUNTER_ABI =")
console.log(JSON.stringify(counter.abi, null, 2))

console.log("\n═══════════════════════════════════════════════════════")
console.log("✅  VOTING — Copy these values into contracts/voting.ts")
console.log("═══════════════════════════════════════════════════════")
console.log("\nexport const VOTING_BYTECODE =")
console.log(`  "${voting.bytecode}"`)
console.log("\nexport const VOTING_ABI =")
console.log(JSON.stringify(voting.abi, null, 2))

console.log("\n✅ Done! Copy the BYTECODE and ABI values above into your contract files.\n")