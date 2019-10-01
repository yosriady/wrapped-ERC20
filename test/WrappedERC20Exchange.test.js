const { assertEvent } = require('./helpers');

const WrappedERC20Exchange = artifacts.require("WrappedERC20Exchange");
const WrappedERC20 = artifacts.require("WrappedERC20");
const MinterRole = artifacts.require("MinterRole");
const PAYToken = artifacts.require("PAYToken");

const WRAPPED_TOKEN_NAME = 'Wrapped PAY';
const WRAPPED_TOKEN_SYMBOL = 'wPAY';
const DECIMALS = 18;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const INITIAL_BALANCE = 1000;

contract("WrappedERC20Exchange", ([deployer, A]) => { 
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

    // Transfer mint permissions to exchange contract
    const mintable = await MinterRole.at(this.wrappedToken.address);
    await mintable.addMinter(this.exchange.address);
    await mintable.renounceMinter();    

    // Setup by minting some PAY to exchange for wPAY
    await this.token.mint(A, 1000);
  });

  it('should initialize correctly', async () => {
    const token = await this.exchange.token();
    assert.equal(token, this.token.address);

    const wrappedToken = await this.exchange.wrappedToken();
    assert.equal(wrappedToken, this.wrappedToken.address);

    // Verify initial token balances
    const tokenBalance = await this.token.balanceOf(A);
    assert.equal(tokenBalance, INITIAL_BALANCE);

    const wrappedTokenBalance = await this.wrappedToken.balanceOf(A);
    assert.equal(wrappedTokenBalance, 0);
  });

  it('can deposit', async () => {
    const DEPOSIT = 100;
    await this.token.approve(this.exchange.address, DEPOSIT, { from: A });

    const allowance = await this.token.allowance(A, this.exchange.address);
    assert.equal(allowance, DEPOSIT);

    await this.exchange.deposit(DEPOSIT, { from: A });

    const newTokenBalance = await this.token.balanceOf(A);
    assert.equal(newTokenBalance, (INITIAL_BALANCE - DEPOSIT));

    const newWrappedTokenBalance = await this.wrappedToken.balanceOf(A);
    assert.equal(newWrappedTokenBalance, DEPOSIT);
  });
  
  it('can withdraw', async () => {
    const WITHDRAW = 100;
    await this.wrappedToken.approve(this.exchange.address, WITHDRAW, { from: A });
    
    const allowance = await this.wrappedToken.allowance(A, this.exchange.address);
    assert.equal(allowance, WITHDRAW);

    await this.exchange.withdraw(WITHDRAW, { from: A });

    const newTokenBalance = await this.token.balanceOf(A);
    assert.equal(newTokenBalance, INITIAL_BALANCE);

    const newWrappedTokenBalance = await this.wrappedToken.balanceOf(A);
    assert.equal(newWrappedTokenBalance, 0);
  });
});