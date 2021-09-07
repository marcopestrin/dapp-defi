const Migrations = artifacts.require("Migrations");

export const migrations = function(deployer: Truffle.Deployer) {
  deployer.deploy(Migrations);
};
