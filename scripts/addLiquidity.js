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
  // https://github.com/Uniswap/contracts-vyper/blob/master/contracts/uniswap_exchange.vy#L51-L57
  // Adding liquidity requires depositing an equivalent value of ETH and the ERC20 tokens (WPAY) 
  // into the ERC20 token’s associated exchange contract.
  
  // [17 Oct] ETH is $176.21, PAY is $0.087 -> 1 ETH ~= 2025 PAY
  // TODO: parameterize these variables
  const min_liquidity = 0; // 0 for first time liquidity is added
  const max_tokens = 1000000000000000000000 // 1000 WPAY, first liquidity
  const deadline = NOW + 300; // 5 minutes (300 secs) from now
  const ethAmount = web3.utils.toWei('0.1', 'ether');
  console.log(ethAmount);
  // await exchange.addLiquidity(min_liquidity, max_tokens, deadline, { value: ethAmount });
  console.log('Completed');

  return process.exit(0);
}

// Usage: node scripts/addLiquidity.js --network rinkeby
main();