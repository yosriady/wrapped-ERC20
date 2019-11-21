export default (networkId) => {
  return (networkId == 1 ? '!!MAINNET!!' : 'TESTNET');
}