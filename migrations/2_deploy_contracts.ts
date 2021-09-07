const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

type Network = "development" | "kovan" | "mainnet";

export const migrations = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[]
  ) => {
    await deployer.deploy(DaiToken);
    await deployer.deploy(DappToken);

    const daiToken = await DaiToken.deployed();
    const dappToken = await DappToken.deployed();

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');
    await daiToken.transfer(accounts[1], '100000000000000000000');
  };
};