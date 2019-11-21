import PAY from "./../abis/PAY.json";
import WPAY from "./../abis/WPAY.json";

const abis = {
  PAY,
  WPAY,
}

export default (contractName, networkId) => {
  const abi = abis[contractName].networks[networkId];
  return abi.address;
}