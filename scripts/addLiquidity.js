require('dotenv').config();
const argv = require('minimist')(process.argv.slice(), { string: ['network', 'token'] });
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contract = require('truffle-contract');
const { getNodeEndpoint, getNetworkId } = require('./utils');
const UniswapExchangeABI = require('../artifacts/uniswap/Exchange.json');

// Start of configurable parameters
const MAINNET_UNISWAP_EXCHANGE_ADDRESS = '';
const RINKEBY_UNISWAP_EXCHANGE_ADDRESS = '0x71e5561e12bc4a5dc21536193ec9d7f0c48b4a19';
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

  const UniswapExchange = contract({ abi: UniswapExchangeABI });
  UniswapExchange.setProvider(provider);
  UniswapExchange.setNetwork(getNetworkId(network));
  UniswapExchange.defaults({
    from: defaultAccount,
  });

  const exchangeAddress = getExchangeAddress(network);
  const exchange = await UniswapExchange.at(exchangeAddress);

  console.log('Approving ... wPAY to Uniswap exchange ${exchangeAddress}')
  // TODO: await wPAY.approve(..., exchangeAddress);


  console.log(`Adding liquidity to Uniswap exchange ${exchangeAddress}`);
  // https://docs.uniswap.io/frontend-integration/pool#add-liquidity
  const min_liquidity = 
  const max_tokens = 
  const deadline = 
  const ethAmount = 
  await exchange.addLiquidity(min_liquidity, max_tokens, deadline, { value: ethAmount });
  console.log('Completed');

  return process.exit(0);
}

// Usage: node scripts/addLiquidity.js --network rinkeby
main();