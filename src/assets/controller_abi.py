CONTROLLER_ABI = '''
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "myid",
				"type": "bytes32"
			},
			{
				"name": "result",
				"type": "string"
			}
		],
		"name": "__callback",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "myid",
				"type": "bytes32"
			},
			{
				"name": "result",
				"type": "string"
			},
			{
				"name": "proof",
				"type": "bytes"
			}
		],
		"name": "__callback",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "addFunds",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newGasPrice",
				"type": "uint256"
			}
		],
		"name": "changeOraclizeGasPrice",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_race",
				"type": "address"
			},
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeRaceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "AddFund",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_bettingDuration",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_raceDuration",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_time",
				"type": "uint256"
			}
		],
		"name": "RaceDeployed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "newOraclizeQuery",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_race",
				"type": "address"
			}
		],
		"name": "enableRefund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "raceAddress",
				"type": "address"
			},
			{
				"name": "coin_pointer",
				"type": "bytes32"
			},
			{
				"name": "result",
				"type": "string"
			},
			{
				"name": "isPrePrice",
				"type": "bool"
			},
			{
				"name": "lastUpdated",
				"type": "uint32"
			}
		],
		"name": "ethorseOracle",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "extractFund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_race",
				"type": "address"
			}
		],
		"name": "manualRecovery",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_race",
				"type": "address"
			}
		],
		"name": "RemoteBettingCloseInfo",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "delay",
				"type": "uint256"
			},
			{
				"name": "locking_duration",
				"type": "uint256"
			},
			{
				"name": "raceAddress",
				"type": "address"
			}
		],
		"name": "setupRace",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bettingDuration",
				"type": "uint256"
			},
			{
				"name": "_raceDuration",
				"type": "uint256"
			},
			{
				"name": "_isOraclizeUsed",
				"type": "bool"
			}
		],
		"name": "spawnRaceManual",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "coinIndex",
		"outputs": [
			{
				"name": "pre",
				"type": "uint256"
			},
			{
				"name": "post",
				"type": "uint256"
			},
			{
				"name": "preOraclizeId",
				"type": "bytes32"
			},
			{
				"name": "postOraclizeId",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "isOraclizeEnabled",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
'''
