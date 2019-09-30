const { assertEvent } = require('./helpers');

const WrappedERC20Factory = artifacts.require("WrappedERC20Factory");
const WrappedERC20 = artifacts.require("WrappedERC20");
const PAYToken = artifacts.require("PAYToken");

const WRAPPED_TOKEN_NAME = 'Wrapped PAY';
const WRAPPED_TOKEN_SYMBOL = 'wPAY';
const DECIMALS = 18;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("WrappedERC20Factory", () => { 
  before(async () => {
    // Deploys ERC20 token
    this.token = await PAYToken.new();

    // Deploys Wrapped ERC20 token
    this.factory = await WrappedERC20Factory.new();
  });

  it('can create exchanges', async () => {
    const result = await this.factory.create(this.token.address);
    // TODO: assertEvent(s)

    // TODO: Verify wrapped token contract address, given token address
    // TODO: verify wrapped token name, symbol, decimals

    // TODO: Verify exchange contract address, given token address
    // TODO: verify minter role is only exchange contract, not deployer
  });  
});