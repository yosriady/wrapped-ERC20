require('dotenv').config();
const argv = require('minimist')(process.argv.slice(), { string: ['network', 'token'] });
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contract = require('truffle-contract');

const UniswapFactoryABI = require('../artifacts/uniswap/Factory.json');
const MAINNET_FACTORY_ADDRESS = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95';
const RINKEBY_FACTORY_ADDRESS = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36';

function getNodeEndpoint(network) {
  const endpoint = `https://${network}.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;
  return endpoint;
}

function getNetworkId(network) {
  switch (network) {
    case 'mainnet':
      return '1';
    case 'rinkeby':
      return '4';
    case 'local':
      return '5777';
    default:
      throw new Error('Invalid network.');
  }
}

function getFactoryAddress(network) {
  switch (network) {
    case 'mainnet':
      return MAINNET_FACTORY_ADDRESS;
    case 'rinkeby':
      return RINKEBY_FACTORY_ADDRESS;
    default:
      throw new Error('Invalid network.');
  }
}

async function main() {
  const { network, token } = argv;
  if (!network || !token) {
    throw new Error('Usage: node scripts/createExchange.js --network rinkeby --token 0x...');
  }

  console.log(`[${network}] Initializing createExchange.js`);
  const provider = new HDWalletProvider(process.env.MNEMONIC, getNodeEndpoint(network));
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];

  const UniswapFactory = contract({ abi: UniswapFactoryABI });
  UniswapFactory.setProvider(provider);
  UniswapFactory.setNetwork(getNetworkId(network));
  UniswapFactory.defaults({
    from: defaultAccount,
  });

  // Note: Uniswap Factory Rinkeby Address
  const factory = await UniswapFactory.at(getFactoryAddress(network));
  console.log(`Creating Exchange for ${token}`);
  await factory.createExchange(token);
  console.log('Completed');
}

// Usage: node scripts/createExchange.js --network rinkeby --token 0x....
// Note that --token refers to wPAY address.
main();