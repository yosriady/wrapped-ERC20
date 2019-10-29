const WrappedERC20Factory = artifacts.require("WrappedERC20Factory");

module.exports = async (deployer) => {
  await deployer.deploy(WrappedERC20Factory);
};
