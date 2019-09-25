const SimpleStorage = artifacts.require("SimpleStorage");
const WrappedERC20Factory = artifacts.require("WrappedERC20Factory");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage); // for sanity check
  deployer.deploy(WrappedERC20Factory);
};
