// contracts/voting.ts
//
// Contract: Voting
// Network:  Base Mainnet (chainId: 8453)
// Compiler: solc 0.8.23+commit.f704f362
// Optimization: ON — runs: 200
// EVM Version: london
//
// What it does:
//   - Deployer creates proposals (text descriptions)
//   - Any wallet can vote ONCE per proposal
//   - Vote counts are public and permanent
//   - Prevents double-voting via mapping check
//   - Emits VoteCast & ProposalCreated events

export const VOTING_BYTECODE =
  "0x60c0604052348015600f57600080fd5b50336080524260a05260805160a0516109c061004460003960006101b601526000818161016e01526103bc01526109c06000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063b2c2f2e811610066578063b2c2f2e814610128578063c7f758a814610149578063d5f3948814610169578063da35c664146101a8578063eae4c19f146101b157600080fd5b80630121b93f14610098578063013cf08b146100ad57806343859632146100d757806349c2a1a614610115575b600080fd5b6100ab6100a636600461060c565b6101d8565b005b6100c06100bb36600461060c565b6102f5565b6040516100ce92919061066b565b60405180910390f35b6101056100e536600461068d565b600260209081526000928352604080842090915290825290205460ff1681565b60405190151581526020016100ce565b6100ab6101233660046106c9565b6103b1565b61013b61013636600461060c565b6104e6565b6040519081526020016100ce565b61015c61015736600461060c565b610535565b6040516100ce919061073d565b6101907f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016100ce565b61013b60015481565b61013b7f000000000000000000000000000000000000000000000000000000000000000081565b60015481106102025760405162461bcd60e51b81526004016101f990610757565b60405180910390fd5b600081815260026020908152604080832033845290915290205460ff16156102645760405162461bcd60e51b8152602060048201526015602482015274159bdd1a5b99ce88185b1c9958591e481d9bdd1959605a1b60448201526064016101f9565b60008181526002602090815260408083203384529091528120805460ff191660019081179091558154909190839081106102a0576102a061078e565b906000526020600020906002020160010160008282546102c091906107ba565b9091555050604051339082907ff1003b73c437642c0460aee9cd9628b0b8c447b66e6c7c905531b9c644214a1190600090a350565b6000818154811061030557600080fd5b9060005260206000209060020201600091509050806000018054610328906107d3565b80601f0160208091040260200160405190810160405280929190818152602001828054610354906107d3565b80156103a15780601f10610376576101008083540402835291602001916103a1565b820191906000526020600020905b81548152906001019060200180831161038457829003601f168201915b5050505050908060010154905082565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461041d5760405162461bcd60e51b81526020600482015260116024820152702b37ba34b7339d103737ba1037bbb732b960791b60448201526064016101f9565b6040805160606020601f8501819004028201810183529181018381526000928291908690869081908501838280828437600092018290525093855250505060209182018190528354600181018555938152208151919260020201908190610484908261087f565b506020820151816001015550506001547f9c770c289ab5bf7e57cb1d23c8ceae993aea46eb64847072fd3d78ca60d3e43283836040516104c5929190610942565b60405180910390a2600180549060006104dd83610971565b91905055505050565b600060015482106105095760405162461bcd60e51b81526004016101f990610757565b6000828154811061051c5761051c61078e565b9060005260206000209060020201600101549050919050565b606060015482106105585760405162461bcd60e51b81526004016101f990610757565b6000828154811061056b5761056b61078e565b90600052602060002090600202016000018054610587906107d3565b80601f01602080910402602001604051908101604052809291908181526020018280546105b3906107d3565b80156106005780601f106105d557610100808354040283529160200191610600565b820191906000526020600020905b8154815290600101906020018083116105e357829003601f168201915b50505050509050919050565b60006020828403121561061e57600080fd5b5035919050565b6000815180845260005b8181101561064b5760208185018101518683018201520161062f565b506000602082860101526020601f19601f83011685010191505092915050565b60408152600061067e6040830185610625565b90508260208301529392505050565b600080604083850312156106a057600080fd5b8235915060208301356001600160a01b03811681146106be57600080fd5b809150509250929050565b600080602083850312156106dc57600080fd5b823567ffffffffffffffff8111156106f357600080fd5b8301601f8101851361070457600080fd5b803567ffffffffffffffff81111561071b57600080fd5b85602082840101111561072d57600080fd5b6020919091019590945092505050565b6020815260006107506020830184610625565b9392505050565b60208082526018908201527f566f74696e673a20696e76616c69642070726f706f73616c0000000000000000604082015260600190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b808201808211156107cd576107cd6107a4565b92915050565b600181811c908216806107e757607f821691505b60208210810361080757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b601f82111561087a578282111561087a57806000526020600020601f840160051c6020851015610851575060005b90810190601f840160051c0360005b8181101561087657600083820155600101610860565b5050505b505050565b815167ffffffffffffffff8111156108995761089961080d565b6108ad816108a784546107d3565b84610823565b6020601f8211600181146108e157600083156108c95750848201515b600019600385901b1c1916600184901b17845561093b565b600084815260208120601f198516915b8281101561091157878501518255602094850194600190920191016108f1565b508482101561092f5786840151600019600387901b60f8161c191681555b505060018360011b0184555b5050505050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b600060018201610983576109836107a4565b506001019056fea264697066735822122058b8b832c36a1d77432f2a84daa90bc48ea08588551d1649dfa7c0f3347cc32a64736f6c63430008230033"

export const VOTING_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "proposalId", type: "uint256" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "proposalId", type: "uint256" },
      { indexed: true, internalType: "address", name: "voter", type: "address" },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [{ internalType: "string", name: "description", type: "string" }],
    name: "createProposal",
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
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "getProposal",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "getVoteCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "proposals",
    outputs: [
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "voteCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

// ─── GAS LIMIT ───────────────────────────────────────────────────────────────
export const VOTING_GAS_LIMIT = 200_000

// ─── SOLIDITY SOURCE ─────────────────────────────────────────────────────────
export const VOTING_SOURCE = `// SPDX-License-Identifier: MIT
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

// ─── COMPILER SETTINGS ───────────────────────────────────────────────────────
export const VOTING_COMPILER = {
  name: "Voting",
  version: "v0.8.35+commit.47b9dedd",
  optimizationUsed: true,
  optimizationRuns: 200,
  evmVersion: "london",
}

// ─── FEE CONSTANTS ───────────────────────────────────────────────────────────
export const VOTING_DEPLOY_FEE_USD = 0.15
export const VOTING_VERIFY_FEE_USD = 0.30