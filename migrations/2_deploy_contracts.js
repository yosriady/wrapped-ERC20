const SimpleStorage = artifacts.require("SimpleStorage");
const WrappedERC20Factory = artifacts.require("WrappedERC20Factory");

module.exports = async (deployer) => {
  await deployer.deploy(SimpleStorage); // for sanity check
  await deployer.deploy(WrappedERC20Factory);
};
