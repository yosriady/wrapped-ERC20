const mapping = {
  1: 'mainnet',
  4: 'rinkeby',
  5777: 'ganache'
}

export default (networkId) => {
  return mapping[networkId];
}