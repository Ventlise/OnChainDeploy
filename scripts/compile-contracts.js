const solc = require("solc")
const path = require("path")
const fs = require("fs")

// ── Solidity sources ──────────────────────────────────────────────────────────

const GM_BEACON_SOURCE = `// SPDX-License-Identifier: MIT
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

const SIMPLE_STORAGE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract SimpleStorage {
    uint256 public storedData;
    string public name;

    constructor(string memory _name) {
        name = _name;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}`

const HELLO_BASE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract HelloBase {
    string public message;
    string public name;

    event MessageUpdated(string newMessage, address updatedBy);

    constructor(string memory _name) {
        name = _name;
        message = "Hello, Base!";
    }

    function setMessage(string calldata _message) public {
        message = _message;
        emit MessageUpdated(_message, msg.sender);
    }
}`

const COUNTER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract Counter {
    uint256 public count;
    string public name;

    constructor(string memory _name) {
        name = _name;
    }

    function increment() public {
        count++;
    }

    function decrement() public {
        require(count > 0, "Counter: already at zero");
        count--;
    }

    function reset() public {
        count = 0;
    }
}`

const VOTING_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    string public ballotName;
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint256 candidateIndex);

    constructor(string memory _name) {
        ballotName = _name;
        candidates.push(Candidate("Option A", 0));
        candidates.push(Candidate("Option B", 0));
    }

    function vote(uint256 candidateIndex) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");
        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        emit Voted(msg.sender, candidateIndex);
    }

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }
}`

// ── Compiler input builder ────────────────────────────────────────────────────

function buildInput(contractName, source) {
  return JSON.stringify({
    language: "Solidity",
    sources: {
      [`${contractName}.sol`]: { content: source },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "london",
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
        },
      },
    },
  })
}

// ── Compile helper ────────────────────────────────────────────────────────────

function compile(contractName, source) {
  console.log(`\n📦 Compiling ${contractName}...`)
  const output = JSON.parse(solc.compile(buildInput(contractName, source)))

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === "error")
    if (errors.length > 0) {
      console.error(`❌ Errors in ${contractName}:`)
      errors.forEach((e) => console.error(e.formattedMessage))
      process.exit(1)
    }
    const warnings = output.errors.filter((e) => e.severity === "warning")
    warnings.forEach((w) => console.warn(`⚠️  Warning: ${w.message}`))
  }

  const contract = output.contracts[`${contractName}.sol`][contractName]
  if (!contract) {
    console.error(`❌ Contract ${contractName} not found in output`)
    process.exit(1)
  }

  const bytecode = "0x" + contract.evm.bytecode.object
  const abi = contract.abi

  console.log(`✅ ${contractName} compiled successfully`)
  console.log(`   Bytecode length: ${bytecode.length} chars`)
  console.log(`   ABI functions: ${abi.filter((x) => x.type === "function").length}`)
  console.log(`\n── BYTECODE ──`)
  console.log(bytecode)
  console.log(`\n── ABI ──`)
  console.log(JSON.stringify(abi, null, 2))

  return { bytecode, abi }
}

// ── Run ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const target = args[0]?.toLowerCase()

const contracts = {
  gmbeacon:      { name: "GMBeacon",      source: GM_BEACON_SOURCE },
  simplestorage: { name: "SimpleStorage", source: SIMPLE_STORAGE_SOURCE },
  hellobase:     { name: "HelloBase",     source: HELLO_BASE_SOURCE },
  counter:       { name: "Counter",       source: COUNTER_SOURCE },
  voting:        { name: "Voting",        source: VOTING_SOURCE },
}

if (target && contracts[target]) {
  compile(contracts[target].name, contracts[target].source)
} else if (!target) {
  Object.values(contracts).forEach(({ name, source }) => compile(name, source))
} else {
  console.error(`❌ Unknown contract: ${target}`)
  console.log(`Available: ${Object.keys(contracts).join(", ")}`)
  process.exit(1)
}