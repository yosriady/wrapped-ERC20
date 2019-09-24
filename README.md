# Wrapped ERC20

Wrapped ERC20 allows you to upgrade older ERC20 token implementations with the [return value bug](https://github.com/Uniswap/uniswap-frontend/issues/320) to the latest standard implementation. This enables a list of previously incompatible ERC20 tokens to access DeFi protocols such as Uniswap.

## Background

TenX aims to provide global banking services built on top of crypto. As such, we want the PAY token to be compatible with the [Top 10 (Decentralized Finance)](http://defipulse.com/) DeFi protocols and give token holders access to the greater DeFi ecosystem moving forward.

The PAY token’s ‘return value bug’  makes it incompatible with several DeFi protocols, including Uniswap and Compound. This is because the PAY token used an older open-source implementation of ERC20 which no longer conform to the latest standard.

Thus, we want to upgrade the PAY token to the latest ERC20 standard.

## How it works

[Wrapped Tokens](https://yos.io/2019/07/13/smart-contract-extensibility-wrapped-tokens/) is a smart contract design pattern where you ‘wrap’ or ‘transform’ an existing crypto asset or Token (ETH, ERC20, BTC) into a new Wrapped Token with additional functionality. In our case, we want to extend PAY with the latest ERC20 functions through a new wPAY token.

![]()

The translation between Token and Wrapped Token is often reversible; users can transform between the two versions at any time. The wrapping process usually involves users locking their Tokens in a smart contract, which then mints an equivalent amount of Wrapped Tokens for the user. Users can trade their Wrapped Tokens to the smart contract to receive their original Tokens back.

### Wrapping ETH

One real-life example of a Wrapped Token is WETH.

Because decentralized platforms running on Ethereum use smart contracts to facilitate trades directly between users, every user needs to have the same standardized format for every token they trade. This format is ERC-20.

Ether or ETH is the native currency built on the Ethereum blockchain. ETH doesn’t conform to the ERC-20 standard. It was built before the ERC20 standard existed. WETH is wrapped Ether that supports the ERC20 interface. With WETH, you are able to trade ETH for other ERC20 tokens on exchanges and DApps.

Here’s the interface of a WETH smart contract:

```
contract IWETH is ERC20 {
  event Deposit(address indexed sender, uint256 amount);
  event Withdrawal(address indexed recipient, uint256 amount);

  function deposit() public payable;
  function withdraw(uint256 amount) public;
  function withdraw(uint256 amount, address user) public;
}
```

When you “wrap” ETH, you’re trading it a smart contract for an equal token called WETH. If you want to get plain ETH back you need to “unwrap” it by trading it back for plain ETH. ETH and WETH are always exchanged at a 1:1 ratio. The Ether collateral is securely locked within the smart contract until it’s traded for WETH at some point in the future.

### Wrapping ERC20

TODO

## Prerequisites

To get started, install the following on your machine:

- Git, Node.js, and NPM
- [Truffle CLI](https://truffleframework.com/truffle) [`v5.1.x`](https://github.com/trufflesuite/truffle/releases/tag/v5.1.1)
- [Ganache](https://truffleframework.com/ganache)
- [Metamask](https://metamask.io/)

## Solidity Learning Materials

New to Solidity? Here are some recommended resources to start with.

- [Truffle Pet Shop tutorial](https://truffleframework.com/tutorials/pet-shop): An end-to-end walkthrough of the basics of building a dApp.
- [Solidity in Depth](http://solidity.readthedocs.io/en/v0.5.0/solidity-in-depth.html): It's important to familiarize yourself with the Solidity language.
- [ERC20 Token Standard Interface](https://theethereum.wiki/w/index.php/ERC20_Token_Standard#The_ERC20_Token_Standard_Interface): Other than the Solidity, you'll want to get familiar with the ERCX standards and EIP proposals within the ecosystem. The ERC20 standard is a widely adopted interface for tokens.
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity): Once you have a firm grasp of the language and standards, start going through open source Solidity projects. The OpenZeppelin project is a  useful (albeit incomplete) overview of what's possible with smart contracts.
- [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/): Helps you understand non-functional requirements within the smart contract ecosystem: design patterns, security, upgradability, and tooling.
- [Ethernaut](https://ethernaut.zeppelin.solutions/): Advanced security topics. Optional, but important.

## Getting Started

- Make sure that **Ganache is up and running locally** at port 8545.
- Go to Settings > Accounts & Keys 
- Disable `Autogenerate HD Mnemonic` and enter a Mnemonic you wish to use.
- Then, do the following:

```
git clone https://github.com/yosriady/dapp-boilerplate
npm install

truffle migrate

cd app/
npm install
npm run start
```

- Import the mnemonic you used in Ganache to Metamask.
- On Metamask, use a 'Custom Network' pointing to `localhost:8545`.
- Open your browser at `localhost:3000`.

## Thanks

**wrapped-ERC20** released under the [MIT] License.<br>
Authored and maintained by TenX with help from contributors ([list][contributors]).

> [yos.io](http://yos.io) &nbsp;&middot;&nbsp;
> GitHub [@yosriady](https://github.com/yosriady)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/tenx-tech/wrapped-ERC20/contributors
