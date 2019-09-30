const { assertEvent } = require('./helpers');

const WrappedERC20Exchange = artifacts.require("WrappedERC20Exchange");
const WrappedERC20 = artifacts.require("WrappedERC20");
const IERC20 = artifacts.require("IERC20");
const PAYToken = artifacts.require("PAYToken");

const WRAPPED_TOKEN_NAME = 'Wrapped PAY';
const WRAPPED_TOKEN_SYMBOL = 'wPAY';
const DECIMALS = 18;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("WrappedERC20Exchange", () => { 
  before(async () => {
    // Deploys ERC20 token
    this.token = await PAYToken.new();

    // Deploys Wrapped ERC20 token
    this.wrappedToken = await WrappedERC20.new(
      WRAPPED_TOKEN_NAME,
      WRAPPED_TOKEN_SYMBOL,
      DECIMALS
    );

    // Deploys exchange contract
    this.exchange = await WrappedERC20Exchange.new(
      this.token.address,
      this.wrappedToken.address,
    );


    // TODO: setup by minting some PAY to exchange for wPAY
  });

  it('should initialize correctly', async () => {
    const token = await this.exchange.token();
    assert.equal(token, this.token.address);

    const wrappedToken = await this.exchange.wrappedToken();
    assert.equal(wrappedToken, this.wrappedToken.address);

    // TODO: verify PAY balance
  });

  it.skip('can deposit', async () => {
    // TODO
  });
  
  it.skip('can withdraw', async () => {
    // TODO
  });
});