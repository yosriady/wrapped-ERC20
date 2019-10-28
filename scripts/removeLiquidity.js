require('dotenv').config();
const argv = require('minimist')(process.argv.slice(), { string: ['network', 'token'] });
const BN = require('bn.js');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contract = require('truffle-contract');
const { getNodeEndpoint, getNetworkId } = require('./utils');
const UniswapExchangeABI = require('../artifacts/uniswap/Exchange.json');

// Start of configurable parameters
const MAINNET_UNISWAP_EXCHANGE_ADDRESS = '';
const RINKEBY_UNISWAP_EXCHANGE_ADDRESS = '0x71e5561e12bc4a5dc21536193ec9d7f0c48b4a19';
const REMOVED_TOKENS = new BN('100000000000000000000'); // 100 PAY
const REMOVED_ETHER = web3.utils.toWei('0.05', 'ether');
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

async function main() {
  const { network } = argv;
  if (!network) {
    throw new Error('Usage: node scripts/removeLiquidity.js --network rinkeby');
  }

  console.log(`[${network}] Initializing removeLiquidity.js`);
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

  console.log(`Removing liquidity from Uniswap exchange ${exchangeAddress}`);
  // https://docs.uniswap.io/frontend-integration/pool#remove-liquidity
  // TODO: parameterize these variables
  const amount = REMOVED_ETHER;
  const min_tokens = REMOVED_TOKENS;
  const min_eth = REMOVED_ETHER;
  const deadline = NOW + 300; // 5 minutes (300 secs) from now
  await exchange.removeLiquidity(amount, min_eth, min_tokens, deadline);
  console.log('Remove Liquidity Completed');

  return process.exit(0);
}

// Usage: node scripts/removeLiquidity.js --network rinkeby
main();