// scripts/compile-contracts.js
const solc = require("solc")

// ─── EXISTING CONTRACTS ───────────────────────────────────────────────────────

const SIMPLE_STORAGE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract SimpleStorage {
    uint256 private storedData;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
        deployedAt = block.timestamp;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}`

const HELLO_BASE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract HelloBase {
    string private message;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event MessageUpdated(string newMessage, address updatedBy);

    constructor(string memory _name) {
        name = _name;
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

const COUNTER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Counter {
    uint256 public count;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event CounterChanged(uint256 newValue, address changedBy);

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
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

    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    Proposal[] public proposals;
    uint256 public proposalCount;

    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter);

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
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

// ─── NEW CONTRACTS ────────────────────────────────────────────────────────────

const MOOD_TRACKER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract MoodTracker {
    string public mood;
    uint256 public lastUpdated;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event MoodUpdated(string newMood, address updatedBy, uint256 timestamp);

    constructor(string memory _name) {
        name = _name;
        mood = "Gm!";
        deployer = msg.sender;
        deployedAt = block.timestamp;
        lastUpdated = block.timestamp;
    }

    function setMood(string calldata newMood) public {
        mood = newMood;
        lastUpdated = block.timestamp;
        emit MoodUpdated(newMood, msg.sender, block.timestamp);
    }

    function getMood() public view returns (string memory) {
        return mood;
    }
}`

const VISITOR_TRACKER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract VisitorTracker {
    uint256 public visitCount;
    address public lastVisitor;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event Visited(address indexed visitor, uint256 totalVisits);

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
        deployedAt = block.timestamp;
    }

    function visit() public {
        visitCount += 1;
        lastVisitor = msg.sender;
        emit Visited(msg.sender, visitCount);
    }

    function getStats() public view returns (uint256, address) {
        return (visitCount, lastVisitor);
    }
}`

const CHAIN_NOTES_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract ChainNotes {
    string public note;
    address public lastAuthor;
    uint256 public lastUpdated;
    string public name;
    address public immutable deployer;
    uint256 public immutable deployedAt;

    event NoteWritten(string note, address author, uint256 timestamp);

    constructor(string memory _name) {
        name = _name;
        deployer = msg.sender;
        deployedAt = block.timestamp;
    }

    function writeNote(string calldata newNote) public {
        note = newNote;
        lastAuthor = msg.sender;
        lastUpdated = block.timestamp;
        emit NoteWritten(newNote, msg.sender, block.timestamp);
    }

    function getNote() public view returns (string memory, address, uint256) {
        return (note, lastAuthor, lastUpdated);
    }
}`

const LUCKY_BLOCK_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

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

// ─── COMPILER FUNCTION ────────────────────────────────────────────────────────

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

// ─── COMPILE ALL 8 CONTRACTS ──────────────────────────────────────────────────

console.log("\n🔨 Compiling all 8 contracts with solc", solc.version(), "\n")

const simpleStorage   = compile("SimpleStorage",   SIMPLE_STORAGE_SOURCE)
const helloBase       = compile("HelloBase",       HELLO_BASE_SOURCE)
const counter         = compile("Counter",         COUNTER_SOURCE)
const voting          = compile("Voting",          VOTING_SOURCE)
const moodTracker     = compile("MoodTracker",     MOOD_TRACKER_SOURCE)
const visitorTracker  = compile("VisitorTracker",  VISITOR_TRACKER_SOURCE)
const chainNotes      = compile("ChainNotes",      CHAIN_NOTES_SOURCE)
const luckyBlock      = compile("LuckyBlock",      LUCKY_BLOCK_SOURCE)

// ─── PRINT RESULTS ────────────────────────────────────────────────────────────

console.log("═══════════════════════════════════════")
console.log("✅ SIMPLE STORAGE BYTECODE:")
console.log(simpleStorage.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ HELLO BASE BYTECODE:")
console.log(helloBase.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ COUNTER BYTECODE:")
console.log(counter.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ VOTING BYTECODE:")
console.log(voting.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ MOOD TRACKER BYTECODE:")
console.log(moodTracker.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ VISITOR TRACKER BYTECODE:")
console.log(visitorTracker.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ CHAIN NOTES BYTECODE:")
console.log(chainNotes.bytecode)

console.log("\n═══════════════════════════════════════")
console.log("✅ LUCKY BLOCK BYTECODE:")
console.log(luckyBlock.bytecode)

// ─── ABI OUTPUT (for updating .ts files) ─────────────────────────────────────

console.log("\n\n═══════════════════════════════════════")
console.log("📋 MOOD TRACKER ABI:")
console.log(JSON.stringify(moodTracker.abi, null, 2))

console.log("\n═══════════════════════════════════════")
console.log("📋 VISITOR TRACKER ABI:")
console.log(JSON.stringify(visitorTracker.abi, null, 2))

console.log("\n═══════════════════════════════════════")
console.log("📋 CHAIN NOTES ABI:")
console.log(JSON.stringify(chainNotes.abi, null, 2))

console.log("\n═══════════════════════════════════════")
console.log("📋 LUCKY BLOCK ABI:")
console.log(JSON.stringify(luckyBlock.abi, null, 2))

const version = solc.version()
const versionString = "v" + version.replace(".Emscripten.clang", "")
console.log("\n✅ Done! Compiler version:", versionString)
console.log("Use this version string in ALL new contract .ts files.")