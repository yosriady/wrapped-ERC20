require('dotenv').config();
const argv = require('minimist')(process.argv.slice(), { string: ['network', 'token'] });
const BN = require('bn.js');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contract = require('truffle-contract');
const { getNodeEndpoint, getNetworkId } = require('./utils');
const UniswapExchangeABI = require('../artifacts/uniswap/Exchange.json');
const { abi: WrappedERC20ABI } = require('../artifacts/abis/WrappedERC20.json');

// Start of configurable parameters
const MAINNET_UNISWAP_EXCHANGE_ADDRESS = '0xde158c2d2000084c502a873a76c4b9a41277d5f5';
const RINKEBY_UNISWAP_EXCHANGE_ADDRESS = '0x71e5561e12bc4a5dc21536193ec9d7f0c48b4a19';
const MAINNET_WPAY_ADDRESS = '0x2ca06986040d18d80acd34d0877e66f8e15f12fc';
const RINKEBY_WPAY_ADDRESS = '0xecdba5e120abf076b65cd480476bb2bdda28ad26';
const INITIAL_LIQUIDITY = new BN('110000000000000000000'); // 110 PAY
const NEW_LIQUIDITY = INITIAL_LIQUIDITY;
const NEW_ETHER = web3.utils.toWei('0.05', 'ether'); // 0.05 ETH
const NOW = Math.round(Date.now() / 1000);
// End of configurable parameters

function getExchangeAddress(network) {
  switch (network) {
    case 'mainnet':
      return MAINNET_UNISWAP_EXCHANGE_ADDRESS;
    case 'rinkeby':
      return RINKEBY_UNISWAP_EXCHANGE_ADDRESS;
    default:
      throw new Error('Invalid network.');
  }
}

function getWrappedTokenAddress(network) {
  switch (network) {
    case 'mainnet':
      return MAINNET_WPAY_ADDRESS;
    case 'rinkeby':
      return RINKEBY_WPAY_ADDRESS;
    default:
      throw new Error('Invalid network.');
  }
}

async function main() {
  const { network } = argv;
  if (!network) {
    throw new Error('Usage: node scripts/addLiquidity.js --network rinkeby');
  }

  console.log(`[${network}] Initializing addLiquidity.js`);
  const provider = new HDWalletProvider(process.env.MNEMONIC, getNodeEndpoint(network));
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];

  const WPAY = contract({ abi: WrappedERC20ABI });
  WPAY.setProvider(provider);
  WPAY.setNetwork(getNetworkId(network));
  WPAY.defaults({
    from: defaultAccount,
  });
  const wrappedTokenAddress = getWrappedTokenAddress(network);
  const wpay = await WPAY.at(wrappedTokenAddress);

  const UniswapExchange = contract({ abi: UniswapExchangeABI });
  UniswapExchange.setProvider(provider);
  UniswapExchange.setNetwork(getNetworkId(network));
  UniswapExchange.defaults({
    from: defaultAccount,
  });
  const exchangeAddress = getExchangeAddress(network);
  const exchange = await UniswapExchange.at(exchangeAddress);

  // console.log(`Approving ${NEW_LIQUIDITY} wPAY to Uniswap exchange ${exchangeAddress}`)
  // await wpay.approve(exchangeAddress, NEW_LIQUIDITY);
  // console.log('Approve Completed');

  console.log(`Adding liquidity to Uniswap exchange ${exchangeAddress}`);
  // https://docs.uniswap.io/frontend-integration/pool#add-liquidity
  // https://github.com/Uniswap/contracts-vyper/blob/master/contracts/uniswap_exchange.vy#L51-L57
  // Adding liquidity requires depositing an equivalent value of ETH and the ERC20 tokens (WPAY) 
  // into the ERC20 token’s associated exchange contract.
  
  // Note: liquidity providers must deposit at the current exchange rate
  // [17 Oct] ETH is $176.21, PAY is $0.087 -> 1 ETH ~= 2025 PAY, 0.1 ETH ~= 203 PAY
  // TODO: parameterize these variables
  const min_liquidity = 0; // 0 for first time liquidity is added
  const max_tokens = NEW_LIQUIDITY;
  const ethAmount = NEW_ETHER;
  const deadline = NOW + 300; // 5 minutes (300 secs) from now
  await exchange.addLiquidity(min_liquidity, max_tokens, deadline, { value: ethAmount });
  console.log('Add Liquidity Completed');

  return process.exit(0);
}

// Usage: node scripts/addLiquidity.js --network rinkeby
main();