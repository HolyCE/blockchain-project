const ResultStorage = artifacts.require("ResultStorage");

module.exports = function(deployer) {
  deployer.deploy(ResultStorage);
};
