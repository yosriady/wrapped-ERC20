const { assertEvent } = require('./helpers');

const WrappedERC20 = artifacts.require("WrappedERC20");

const TOKEN_NAME = 'Wrapped PAY Token';
const TOKEN_SYMBOL = 'wPAY';
const TOKEN_DECIMALS = 18;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("WrappedERC20", ([minter, payee, stranger]) => { 
  before(async () => {
    // Deploys Wrapped ERC20 token
    this.token = await WrappedERC20.new(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      TOKEN_DECIMALS
    );
  });

  it('should initialize correctly', async () => {
    const name = await this.token.name();
    const symbol = await this.token.symbol();
    const decimals = await this.token.decimals();

    assert.equal(name, TOKEN_NAME);
    assert.equal(symbol, TOKEN_SYMBOL);
    assert.equal(decimals, TOKEN_DECIMALS);
  });

  it('should be mintable', async () => {
    const isMinter = await this.token.isMinter(minter);
    assert.equal(isMinter, true);

    const balance = await this.token.balanceOf(payee);
    assert.equal(balance, 0);

    const result = await this.token.mint(payee, 123, { from: minter });
    assertEvent(result, {
      event: 'Transfer',
      args: {
        from: ZERO_ADDRESS,
        to: payee,
        value: 123,
      },
    }, 'A Minted event is emitted.');

    const newBalance = await this.token.balanceOf(payee);
    assert.equal(newBalance, 123);
  });

  it('should be burnable by owner', async () => {
    const result = await this.token.burn(100, { from: payee });

    assertEvent(result, {
      event: 'Transfer',
      args: {
        from: payee,
        to: ZERO_ADDRESS,
        value: 100,
      },
    }, 'A Burned event is emitted.');

    const newBalance = await this.token.balanceOf(payee);
    assert.equal(newBalance, 23);
  });

  it('should be burnable by allowance', async () => {
    await this.token.approve(stranger, 23, { from: payee });

    await this.token.burnFrom(payee, 23, { from: stranger });

    const newBalance = await this.token.balanceOf(payee);
    assert.equal(newBalance, 0);
  });
});