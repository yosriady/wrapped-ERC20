import PAY from "./../abis/PAYToken.json";

const abis = {
  PAY,
}

export default (contractName, networkID) => {
  const abi = abis[contractName]['networks'][networkId].address;
}