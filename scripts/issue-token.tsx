const TokenFarm = artifacts.require("TokenFarm");

export default async function(callback) {
  const tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueTokens();
  callback();
}
