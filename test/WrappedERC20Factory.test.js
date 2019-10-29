const { assertEvent } = require('./helpers');

const WrappedERC20Factory = artifacts.require("WrappedERC20Factory");
const WrappedERC20 = artifacts.require("WrappedERC20");
const PAYToken = artifacts.require("PAYToken");

const WRAPPED_TOKEN_NAME = 'Wrapped PAY Token';
const WRAPPED_TOKEN_SYMBOL = 'WPAY';
const DECIMALS = 18;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("WrappedERC20Factory", ([deployer]) => { 
  before(async () => {
    // Deploys ERC20 token
    this.token = await PAYToken.new();

    // Deploys Wrapped ERC20 token
    this.factory = await WrappedERC20Factory.new();
  });

  it('can create exchanges', async () => {
    const result = await this.factory.create(this.token.address);

    // Verify wrapped token contract address, given token address
    const wrappedTokenAddress = await this.factory.wrappedTokens(this.token.address);
    assert(wrappedTokenAddress !== ZERO_ADDRESS);
    assertEvent(result, {
      event: 'WrappedTokenCreated',
      args: {
        collateral: this.token.address,
        wrappedToken: wrappedTokenAddress,
      },
    }, 'A WrappedTokenCreated event is emitted.', 0);

    const wrappedToken = await WrappedERC20.at(wrappedTokenAddress);
    const name = await wrappedToken.name();
    const symbol = await wrappedToken.symbol();
    const decimals = await wrappedToken.decimals();

    assert.equal(name, WRAPPED_TOKEN_NAME);
    assert.equal(symbol, WRAPPED_TOKEN_SYMBOL);
    assert.equal(decimals, DECIMALS);

    // Verify exchange contract address, given token address
    const exchangeAddress = await this.factory.exchanges(this.token.address);
    assert(exchangeAddress !== ZERO_ADDRESS);
    assertEvent(result, {
      event: 'ExchangeCreated',
      args: {
        collateral: this.token.address,
        exchange: exchangeAddress,
      },
    }, 'A ExchangeCreated event is emitted.', 1);

    // Verify mint permissions is transferred from deployer to exchange contract
    const deployerIsMinter = await wrappedToken.isMinter(deployer);
    assert.equal(deployerIsMinter, false);
    const exchangeIsMinter = await wrappedToken.isMinter(exchangeAddress);
    assert.equal(exchangeIsMinter, true);
  });  
});