// scripts/compile-contracts.js
const solc = require("solc")

const COUNTER_SOURCE = `// SPDX-License-Identifier: MIT
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

const VOTING_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

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

const HELLO_BASE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract HelloBase {
    string private message;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event MessageUpdated(string newMessage, address updatedBy);

    constructor() {
        message = "Hello, Base!";
        deployer = msg.sender;
        deployedAt = block.timestamp;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string calldata newMessage) public {
        message = newMessage;
        emit MessageUpdated(newMessage, msg.sender);
    }
}`

function compile(contractName, source) {
  const input = {
    language: "Solidity",
    sources: { [`${contractName}.sol`]: { content: source } },
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
      console.error(`\n❌ Errors for ${contractName}:`)
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

console.log("\n🔨 Compiling with solc", solc.version(), "\n")

const counter   = compile("Counter",   COUNTER_SOURCE)
const voting    = compile("Voting",    VOTING_SOURCE)
const helloBase = compile("HelloBase", HELLO_BASE_SOURCE)

console.log("═══════════════════════════════════════")
console.log("✅ COUNTER BYTECODE:")
console.log(counter.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ VOTING BYTECODE:")
console.log(voting.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ HELLO BASE BYTECODE:")
console.log(helloBase.bytecode)

console.log("\n✅ Done! solc version:", solc.version())
console.log("Use version string: v" + solc.version().split("+commit")[0] + "+commit" + solc.version().split("+commit")[1].split(".")[0])