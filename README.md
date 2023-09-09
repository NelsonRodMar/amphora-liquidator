# Amphora Liquidator Bot


This is liquidation bot for [Amphora Finance](https://amphorafinance.com/) build to be used with [OpenZeppelin Autotask](https://docs.openzeppelin.com/defender/v1/autotasks).


## 🏺 What is Amphora Finance ? 
Amphora Finance  is a CDP borrow/lend protocol.

Users deposit sUSD(v3) to lend, and in turn recieve USDA a rebasing token that automatically rebases collecting yield.

To borrow from the sUSD pool, users open a "vault" and deposit collateral. Each vault is unique to a user keeping isolated positions and it can recieve both ERC-20 tokens and Curve LP tokens.

Curve LP tokens are deposited into their relative pools on Convex, so that users continue to earn CRV and CVX rewards while using the assets as collateral.

The protocol takes a small fee of the CRV and CVX rewards and in exchange rewars the user with $AMPH the protocols governance token.

## 📍  How to run in local ?

1. First you need to install the dependencies

```yarn
yarn install
```

2. Copy-Past the .env.example and fill it with your information

```shell
copy .env.example .env
```

3. And now you can run it

```shell
node index.js
```

## 🤖  How to run on OpenZeppelin Autotask ?

1. First you need to create a Relay, check documentation here : [https://docs.openzeppelin.com/defender/v1/relay](https://docs.openzeppelin.com/defender/v1/relay)

2. Then you need to create a new Autotask and copy-past the `index.js` content and past in your Autotask.


## 🆕  How to update OpenZeppelin Autotask ?

Re-upload the file or run the following command :

```yarn
 yarn update-code $AUTOTASK_ID autotask
```

