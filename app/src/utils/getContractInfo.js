import PAY from "./../abis/PAY.json";
import WPAY from "./../abis/WPAY.json";
import WPAYExchange from "./../abis/WPAYExchange.json";

const subdomains = {
  "1": "",
  "4": "rinkeby."
}
const abis = {
  PAY,
  WPAY,
  WPAYExchange
}

export default (contractName, networkId) => {
  const abi = abis[contractName].networks[networkId];
  const address = abi.address;
  const etherscan = `https://${subdomains[networkId]}etherscan.io/address/${address}`;
  return {
    address,
    etherscan 
  };;
}