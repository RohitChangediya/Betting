CONTRACT_ABI='''
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "horse",
				"type": "bytes32"
			}
		],
		"name": "placeBet",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "claim_reward",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "winner_horse",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "coin_pointer",
				"type": "bytes32"
			},
			{
				"name": "result",
				"type": "uint256"
			},
			{
				"name": "isPrePrice",
				"type": "bool"
			}
		],
		"name": "priceCallback",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winnerPoolTotal",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "horses",
		"outputs": [
			{
				"name": "BTC_delta",
				"type": "int64"
			},
			{
				"name": "ETH_delta",
				"type": "int64"
			},
			{
				"name": "LTC_delta",
				"type": "int64"
			},
			{
				"name": "BTC",
				"type": "bytes32"
			},
			{
				"name": "ETH",
				"type": "bytes32"
			},
			{
				"name": "LTC",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "forceVoidExternal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "version",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "refund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getChronus",
		"outputs": [
			{
				"name": "",
				"type": "uint32[]"
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
				"name": "index",
				"type": "bytes32"
			},
			{
				"name": "candidate",
				"type": "address"
			}
		],
		"name": "getCoinIndex",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "chronus",
		"outputs": [
			{
				"name": "betting_open",
				"type": "bool"
			},
			{
				"name": "race_start",
				"type": "bool"
			},
			{
				"name": "race_end",
				"type": "bool"
			},
			{
				"name": "voided_bet",
				"type": "bool"
			},
			{
				"name": "starting_time",
				"type": "uint32"
			},
			{
				"name": "betting_duration",
				"type": "uint32"
			},
			{
				"name": "race_duration",
				"type": "uint32"
			},
			{
				"name": "voided_timestamp",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bettingDuration",
				"type": "uint32"
			},
			{
				"name": "_raceDuration",
				"type": "uint32"
			}
		],
		"name": "setupRace",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "reward_total",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "checkReward",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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
				"name": "total",
				"type": "uint160"
			},
			{
				"name": "count",
				"type": "uint32"
			},
			{
				"name": "price_check",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "total_reward",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "recovery",
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
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_horse",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_date",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "coin_pointer",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "result",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "isPrePrice",
				"type": "bool"
			}
		],
		"name": "PriceCallback",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "reason",
				"type": "string"
			}
		],
		"name": "RefundEnabled",
		"type": "event"
	}
]
'''
