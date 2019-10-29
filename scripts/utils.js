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


module.exports = {
  getNodeEndpoint,
  getNetworkId,
};
