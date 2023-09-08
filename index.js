require('dotenv').config()
const {DefenderRelaySigner, DefenderRelayProvider} = require('defender-relay-client/lib/ethers');
const {ethers, BigNumber} = require("ethers");
const VAULTCONTROLLER_ABI = [{
    "inputs": [{
        "internalType": "contract IVaultController",
        "name": "_oldVaultController",
        "type": "address"
    }, {
        "internalType": "address[]",
        "name": "_tokenAddresses",
        "type": "address[]"
    }, {
        "internalType": "contract IAMPHClaimer",
        "name": "_claimerContract",
        "type": "address"
    }, {
        "internalType": "contract IVaultDeployer",
        "name": "_vaultDeployer",
        "type": "address"
    }, {"internalType": "uint192", "name": "_initialBorrowingFee", "type": "uint192"}, {
        "internalType": "address",
        "name": "_booster",
        "type": "address"
    }, {"internalType": "uint192", "name": "_liquidationFee", "type": "uint192"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {"inputs": [], "name": "VaultController_CapReached", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_FeeTooLarge",
    "type": "error"
}, {"inputs": [], "name": "VaultController_LTVIncompatible", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_LiquidateZeroTokens",
    "type": "error"
}, {"inputs": [], "name": "VaultController_NotValidVault", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_OnlyMinter",
    "type": "error"
}, {"inputs": [], "name": "VaultController_OnlyPauser", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_OracleNotRegistered",
    "type": "error"
}, {"inputs": [], "name": "VaultController_OverLiquidation", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_RepayTooMuch",
    "type": "error"
}, {"inputs": [], "name": "VaultController_TokenAddressDoesNotMatchLpAddress", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_TokenAlreadyRegistered",
    "type": "error"
}, {"inputs": [], "name": "VaultController_TokenNotRegistered", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_TooManyDecimals",
    "type": "error"
}, {"inputs": [], "name": "VaultController_VaultDoesNotExist", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_VaultInsolvent",
    "type": "error"
}, {"inputs": [], "name": "VaultController_VaultSolvent", "type": "error"}, {
    "inputs": [],
    "name": "VaultController_WrongCollateralAddress",
    "type": "error"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "_vaultId", "type": "uint256"}, {
        "indexed": false,
        "internalType": "address",
        "name": "_vaultAddress",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "_borrowAmount", "type": "uint256"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
    }],
    "name": "BorrowUSDA",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "contract IAMPHClaimer",
        "name": "_oldClaimerContract",
        "type": "address"
    }, {"indexed": false, "internalType": "contract IAMPHClaimer", "name": "_newClaimerContract", "type": "address"}],
    "name": "ChangedClaimerContract",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint192",
        "name": "_oldBorrowingFee",
        "type": "uint192"
    }, {"indexed": false, "internalType": "uint192", "name": "_newBorrowingFee", "type": "uint192"}],
    "name": "ChangedInitialBorrowingFee",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint192",
        "name": "_oldLiquidationFee",
        "type": "uint192"
    }, {"indexed": false, "internalType": "uint192", "name": "_newLiquidationFee", "type": "uint192"}],
    "name": "ChangedLiquidationFee",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "contract IVaultController",
        "name": "_oldVaultController",
        "type": "address"
    }, {"indexed": false, "internalType": "address[]", "name": "_tokenAddresses", "type": "address[]"}],
    "name": "CollateralsMigratedFrom",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint64", "name": "_epoch", "type": "uint64"}, {
        "indexed": false,
        "internalType": "uint192",
        "name": "_amount",
        "type": "uint192"
    }, {"indexed": false, "internalType": "uint256", "name": "_curveVal", "type": "uint256"}],
    "name": "InterestEvent",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "_vaultId", "type": "uint256"}, {
        "indexed": false,
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "_usdaToRepurchase", "type": "uint256"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokensToLiquidate",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "_liquidationFee", "type": "uint256"}],
    "name": "Liquidate",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint192", "name": "_protocolFee", "type": "uint192"}],
    "name": "NewProtocolFee",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "_vaultAddress",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "_vaultId", "type": "uint256"}, {
        "indexed": false,
        "internalType": "address",
        "name": "_vaultOwner",
        "type": "address"
    }],
    "name": "NewVault",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
    "name": "Paused",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "_curveMasterAddress", "type": "address"}],
    "name": "RegisterCurveMaster",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "_usdaContractAddress", "type": "address"}],
    "name": "RegisterUSDA",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "_ltv", "type": "uint256"}, {
        "indexed": false,
        "internalType": "address",
        "name": "_oracleAddress",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_liquidationIncentive",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "_cap", "type": "uint256"}],
    "name": "RegisteredErc20",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "_vaultId", "type": "uint256"}, {
        "indexed": false,
        "internalType": "address",
        "name": "_vaultAddress",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "_repayAmount", "type": "uint256"}],
    "name": "RepayUSDA",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
    "name": "Unpaused",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "_ltv", "type": "uint256"}, {
        "indexed": false,
        "internalType": "address",
        "name": "_oracleAddress",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_liquidationIncentive",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "_cap", "type": "uint256"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
    }],
    "name": "UpdateRegisteredErc20",
    "type": "event"
}, {
    "inputs": [],
    "name": "BOOSTER",
    "outputs": [{"internalType": "contract IBooster", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "DOUBLE_SCALE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "EXP_SCALE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "HALF_EXP_SCALE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MANTISSA_ONE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MAX_DECIMALS",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MAX_INIT_BORROWING_FEE",
    "outputs": [{"internalType": "uint192", "name": "", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "UINT128_MAX",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "UINT192_MAX",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "VAULT_DEPLOYER",
    "outputs": [{"internalType": "contract IVaultDeployer", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}],
    "name": "amountToSolvency",
    "outputs": [{"internalType": "uint256", "name": "_usdaToSolvency", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "baseRewardContracts",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "uint192",
        "name": "_amount",
        "type": "uint192"
    }], "name": "borrowUSDA", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "uint192",
        "name": "_amount",
        "type": "uint192"
    }, {"internalType": "address", "name": "_target", "type": "address"}],
    "name": "borrowUSDAto",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "uint192",
        "name": "_susdAmount",
        "type": "uint192"
    }, {"internalType": "address", "name": "_target", "type": "address"}],
    "name": "borrowsUSDto",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "calculateInterest",
    "outputs": [{"internalType": "uint256", "name": "_interest", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "contract IAMPHClaimer", "name": "_newClaimerContract", "type": "address"}],
    "name": "changeClaimerContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint192", "name": "_newBorrowingFee", "type": "uint192"}],
    "name": "changeInitialBorrowingFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint192", "name": "_newLiquidationFee", "type": "uint192"}],
    "name": "changeLiquidationFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint192", "name": "_newProtocolFee", "type": "uint192"}],
    "name": "changeProtocolFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}],
    "name": "checkVault",
    "outputs": [{"internalType": "bool", "name": "_overCollateralized", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "claimerContract",
    "outputs": [{"internalType": "contract IAMPHClaimer", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "curveMaster",
    "outputs": [{"internalType": "contract CurveMaster", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "enabledTokens",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint192", "name": "_amount", "type": "uint192"}],
    "name": "getBorrowingFee",
    "outputs": [{"internalType": "uint192", "name": "_fee", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_start", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_end",
        "type": "uint256"
    }],
    "name": "getCollateralsInfo",
    "outputs": [{
        "components": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "ltv", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "cap",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "totalDeposited", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "liquidationIncentive",
            "type": "uint256"
        }, {
            "internalType": "contract IOracleRelay",
            "name": "oracle",
            "type": "address"
        }, {
            "internalType": "enum IVaultController.CollateralType",
            "name": "collateralType",
            "type": "uint8"
        }, {
            "internalType": "contract IBaseRewardPool",
            "name": "crvRewardsContract",
            "type": "address"
        }, {"internalType": "uint256", "name": "poolId", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "decimals",
            "type": "uint256"
        }], "internalType": "struct IVaultController.CollateralInfo[]", "name": "_collateralsInfo", "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getEnabledTokens",
    "outputs": [{"internalType": "address[]", "name": "_enabledTokens", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint192", "name": "_tokensToLiquidate", "type": "uint192"}, {
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
    }],
    "name": "getLiquidationFee",
    "outputs": [{"internalType": "uint192", "name": "_fee", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "initialBorrowingFee",
    "outputs": [{"internalType": "uint192", "name": "", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "interest",
    "outputs": [{"internalType": "uint64", "name": "lastTime", "type": "uint64"}, {
        "internalType": "uint192",
        "name": "factor",
        "type": "uint192"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "interestFactor",
    "outputs": [{"internalType": "uint192", "name": "_interestFactor", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "lastInterestTime",
    "outputs": [{"internalType": "uint64", "name": "_lastInterestTime", "type": "uint64"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
    }, {"internalType": "uint256", "name": "_tokensToLiquidate", "type": "uint256"}],
    "name": "liquidateVault",
    "outputs": [{"internalType": "uint256", "name": "_toLiquidate", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "liquidationFee",
    "outputs": [{"internalType": "uint192", "name": "", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "mintVault",
    "outputs": [{"internalType": "address", "name": "_vaultAddress", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_vaultID", "type": "uint96"}, {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
    }, {"internalType": "address", "name": "_token", "type": "address"}, {
        "internalType": "bool",
        "name": "_increase",
        "type": "bool"
    }], "name": "modifyTotalDeposited", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {"inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}],
    "name": "peekCheckVault",
    "outputs": [{"internalType": "bool", "name": "_overCollateralized", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "protocolFee",
    "outputs": [{"internalType": "uint192", "name": "", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_masterCurveAddress", "type": "address"}],
    "name": "registerCurveMaster",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}, {
        "internalType": "uint256",
        "name": "_ltv",
        "type": "uint256"
    }, {"internalType": "address", "name": "_oracleAddress", "type": "address"}, {
        "internalType": "uint256",
        "name": "_liquidationIncentive",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_cap", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
    }], "name": "registerErc20", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_usdaAddress", "type": "address"}],
    "name": "registerUSDA",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}],
    "name": "repayAllUSDA",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "uint192",
        "name": "_amount",
        "type": "uint192"
    }], "name": "repayUSDA", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
    }, {"internalType": "uint256", "name": "_tokensToLiquidate", "type": "uint256"}],
    "name": "simulateLiquidateVault",
    "outputs": [{
        "internalType": "uint256",
        "name": "_collateralLiquidated",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_usdaPaid", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "tokenAddressCollateralInfo",
    "outputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "ltv",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "cap", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "totalDeposited",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "liquidationIncentive",
        "type": "uint256"
    }, {
        "internalType": "contract IOracleRelay",
        "name": "oracle",
        "type": "address"
    }, {
        "internalType": "enum IVaultController.CollateralType",
        "name": "collateralType",
        "type": "uint8"
    }, {
        "internalType": "contract IBaseRewardPool",
        "name": "crvRewardsContract",
        "type": "address"
    }, {"internalType": "uint256", "name": "poolId", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "decimals",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenCap",
    "outputs": [{"internalType": "uint256", "name": "_cap", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenCollateralInfo",
    "outputs": [{
        "components": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "ltv", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "cap",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "totalDeposited", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "liquidationIncentive",
            "type": "uint256"
        }, {
            "internalType": "contract IOracleRelay",
            "name": "oracle",
            "type": "address"
        }, {
            "internalType": "enum IVaultController.CollateralType",
            "name": "collateralType",
            "type": "uint8"
        }, {
            "internalType": "contract IBaseRewardPool",
            "name": "crvRewardsContract",
            "type": "address"
        }, {"internalType": "uint256", "name": "poolId", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "decimals",
            "type": "uint256"
        }], "internalType": "struct IVaultController.CollateralInfo", "name": "_collateralInfo", "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenCollateralType",
    "outputs": [{"internalType": "enum IVaultController.CollateralType", "name": "_type", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenCrvRewardsContract",
    "outputs": [{"internalType": "contract IBaseRewardPool", "name": "_crvRewardsContract", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenId",
    "outputs": [{"internalType": "uint256", "name": "_tokenId", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenLTV",
    "outputs": [{"internalType": "uint256", "name": "_ltv", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenLiquidationIncentive",
    "outputs": [{"internalType": "uint256", "name": "_liquidationIncentive", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenPoolId",
    "outputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokenTotalDeposited",
    "outputs": [{"internalType": "uint256", "name": "_totalDeposited", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "name": "tokensOracle",
    "outputs": [{"internalType": "contract IOracleRelay", "name": "_oracle", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "tokensRegistered",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}, {
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
    }],
    "name": "tokensToLiquidate",
    "outputs": [{"internalType": "uint256", "name": "_tokensToLiquidate", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "totalBaseLiability",
    "outputs": [{"internalType": "uint192", "name": "", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}, {
        "internalType": "uint256",
        "name": "_ltv",
        "type": "uint256"
    }, {"internalType": "address", "name": "_oracleAddress", "type": "address"}, {
        "internalType": "uint256",
        "name": "_liquidationIncentive",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_cap", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
    }], "name": "updateRegisteredErc20", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [],
    "name": "usda",
    "outputs": [{"internalType": "contract IUSDA", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}],
    "name": "vaultBorrowingPower",
    "outputs": [{"internalType": "uint192", "name": "_borrowPower", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_wallet", "type": "address"}],
    "name": "vaultIDs",
    "outputs": [{"internalType": "uint96[]", "name": "_vaultIDs", "type": "uint96[]"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "", "type": "uint96"}],
    "name": "vaultIdVaultAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_id", "type": "uint96"}],
    "name": "vaultLiability",
    "outputs": [{"internalType": "uint192", "name": "_liability", "type": "uint192"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint96", "name": "_start", "type": "uint96"}, {
        "internalType": "uint96",
        "name": "_stop",
        "type": "uint96"
    }],
    "name": "vaultSummaries",
    "outputs": [{
        "components": [{"internalType": "uint96", "name": "id", "type": "uint96"}, {
            "internalType": "uint192",
            "name": "borrowingPower",
            "type": "uint192"
        }, {"internalType": "uint192", "name": "vaultLiability", "type": "uint192"}, {
            "internalType": "address[]",
            "name": "tokenAddresses",
            "type": "address[]"
        }, {"internalType": "uint256[]", "name": "tokenBalances", "type": "uint256[]"}],
        "internalType": "struct IVaultController.VaultSummary[]",
        "name": "_vaultSummaries",
        "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "vaultsMinted",
    "outputs": [{"internalType": "uint96", "name": "", "type": "uint96"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "walletVaultIDs",
    "outputs": [{"internalType": "uint96", "name": "", "type": "uint96"}],
    "stateMutability": "view",
    "type": "function"
}];
const VAULTCONTROLLER_ADDRESS = '0xb688801cadb4Ddb6980bb777d42972C24f920855';

// Entrypoint for the Autotask
exports.handler = async function (credentials) {
    // Initialize defender relayer provider and signer
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {speed: 'fast'});

    // Create contract instance from the signer and use it to send a tx
    const contract = new ethers.Contract(VAULTCONTROLLER_ADDRESS, VAULTCONTROLLER_ABI, signer);

    // We check that contract is not paused to be sure that we can liquidte
    const isPaused = await contract.paused();
    if (isPaused === false) {
        // We get the total number of vault that exist
        const totalVault = await contract.vaultsMinted();
        console.log('Total vault :', totalVault.toString());

        // We get all the information of all the existing vault
        const vaultSummaries = await contract.vaultSummaries(BigNumber.from(1), totalVault);

        // We iterate on each vault
        for (let id = 0; id < vaultSummaries.length; id++) {
            var vaultBorrowingPower = await contract.vaultBorrowingPower(vaultSummaries[id].id);
            // We check if vault liability is superior to vault borrowing power to know if need to be liquididated
            if (vaultSummaries[id].vaultLiability.toBigInt() > vaultBorrowingPower.toBigInt()) {
                // We iterate over all the token in the vault
                for (let tokenId = 0; tokenId < vaultSummaries[tokenId].tokenAddresses.length; tokenId++) {
                    // If token balance > 0 we can liquidate
                    if (vaultSummaries[id].tokenBalances[tokenId] > 0) {
                        // We first simulate to be sure that we can liquidate
                        const txSimulateLiquidateVault = await contract.simulateLiquidateVault(
                            vaultSummaries[id].id, // Vault Id
                            vaultSummaries[id].tokenAddresses[tokenId], // Token Address
                            vaultSummaries[id].tokenBalances[tokenId] // Token Balance to liquidate
                        );
                        //TODO : Add the liquidation of the vault
                    }
                }
            }
        }
    } else {
        console.log("Cant perform action contract is paused");
    }
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
    const credentials = {apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET};
    exports.handler(credentials)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}