const WrappedERC20 = artifacts.require("WrappedERC20");

const TOKEN_NAME = 'Wrapped PAY';
const TOKEN_SYMBOL = 'wPAY';
const TOKEN_DECIMALS = 18;

contract("WrappedERC20", () => { 
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
    
  });

  it('should be burnable', async () => {
    
  });
});