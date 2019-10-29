const WrappedERC20Factory = artifacts.require("WrappedERC20Factory");
const PAYToken = artifacts.require("PAYToken");

const MAINNET_PAY = '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280';

module.exports = async (deployer, network) => {
  const factory = await WrappedERC20Factory.deployed();

  let pay;
  if (network === 'mainnet' || network === 'mainnet-fork') {
    pay = MAINNET_PAY;
  } else {
    const payToken = await deployer.deploy(PAYToken);
    pay = payToken.address;
  }

  await factory.create(pay);
};
