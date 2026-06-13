/**
 * contracts/lucky-block.ts
 * Contract:    LuckyBlock
 * Network:     Base Mainnet (chainId: 8453)
 * Compiler:    solc v0.8.35+commit.47b9dedd
 * Optimization: ON — runs: 200
 * EVM Version: london
 * Constructor: string memory _name (makes every deployment unique)
 */

export const LUCKY_BLOCK_BYTECODE =
  "0x60c060405234801561001057600080fd5b5060405161060c38038061060c83398101604081905261002f91610060565b600161003b82826101c2565b5050336080524260a052610284565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561007257600080fd5b81516001600160401b0381111561008857600080fd5b8201601f8101841361009957600080fd5b80516001600160401b038111156100b2576100b261004a565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100e0576100e061004a565b6040528181528282016020018610156100f857600080fd5b60005b82811015610117576020818501810151838301820152016100fb565b50600091810160200191909152949350505050565b600181811c9082168061014057607f821691505b60208210810361016057634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156101bd57828211156101bd57806000526020600020601f840160051c6020851015610194575060005b90810190601f840160051c0360005b818110156101b9576000838201556001016101a3565b5050505b505050565b81516001600160401b038111156101db576101db61004a565b6101ef816101e9845461012c565b84610166565b6020601f821160018114610223576000831561020b5750848201515b600019600385901b1c1916600184901b17845561027d565b600084815260208120601f198516915b828110156102535787850151825560209485019460019092019101610233565b50848210156102715786840151600019600387901b60f8161c191681555b505060018360011b0184555b5050505050565b60805160a0516103636102a960003960006101650152600061010601526103636000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806370d2cd111161005b57806370d2cd11146100ec578063d5f3948814610101578063d75f6f1b14610140578063eae4c19f1461016057600080fd5b806306fdde03146100825780630cee948d146100a05780634f293734146100d7575b600080fd5b61008a610187565b604051610097919061025c565b60405180910390f35b6100c96100ae3660046102aa565b6001600160a01b031660009081526020819052604090205490565b604051908152602001610097565b6100ea6100e53660046102da565b610215565b005b336000908152602081905260409020546100c9565b6101287f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610097565b6100c961014e3660046102aa565b60006020819052908152604090205481565b6100c97f000000000000000000000000000000000000000000000000000000000000000081565b60018054610194906102f3565b80601f01602080910402602001604051908101604052809291908181526020018280546101c0906102f3565b801561020d5780601f106101e25761010080835404028352916020019161020d565b820191906000526020600020905b8154815290600101906020018083116101f057829003601f168201915b505050505081565b336000818152602081815260409182902084905590518381527f228fafaeeb0fe3b00f73f1f901d6709650eaf2bd2ab61c3fd7d706db96594069910160405180910390a250565b602081526000825180602084015260005b8181101561028a576020818601810151604086840101520161026d565b506000604082850101526040601f19601f83011684010191505092915050565b6000602082840312156102bc57600080fd5b81356001600160a01b03811681146102d357600080fd5b9392505050565b6000602082840312156102ec57600080fd5b5035919050565b600181811c9082168061030757607f821691505b60208210810361032757634e487b7160e01b600052602260045260246000fd5b5091905056fea264697066735822122057665e15434a1759ade268b4cb888f4fe47adba1ccdc470324c40bc8a6eed37864736f6c63430008230033"

export const LUCKY_BLOCK_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "LuckyNumberSet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "deployedAt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deployer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getLuckyNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyLuckyNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "luckyNumbers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "setLuckyNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const LUCKY_BLOCK_GAS_LIMIT = 220_000

export const LUCKY_BLOCK_SOURCE = `// SPDX-License-Identifier: MIT
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

export const LUCKY_BLOCK_COMPILER = {
  name: "LuckyBlock",
  version: "v0.8.35+commit.47b9dedd",
  optimizationUsed: true,
  optimizationRuns: 200,
  evmVersion: "london",
}

export const LUCKY_BLOCK_DEPLOY_FEE_USD = 0
export const LUCKY_BLOCK_VERIFY_FEE_USD = 0.09
