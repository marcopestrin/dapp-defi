const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    })

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      let result

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      console.log("DAITOKEN BALANCE BEFORE STAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
      await tokenFarm.stakeTokens(tokens('100'), { from: investor });
      console.log("----");
      console.log("stake token!");
      console.log("----");

      // Check staking result
      result = await daiToken.balanceOf(investor);
      console.log("DAITOKEN BALANCE AFTER STAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      console.log("TOKENFARM BALANCE AFTER STAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

      result = await tokenFarm.stakingBalance(investor);
      console.log("STAKING BALANCE AFTER STAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking');

      result = await tokenFarm.isStaking(investor);
      console.log("STATUS STAKING", result);
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking');

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })
      console.log("----");
      console.log("issue tokens!");
      console.log("----");

      // Check balances after issuance
      result = await dappToken.balanceOf(investor);
      console.log("DAPPTOKEN BALANCE AFTER ISSUANCE", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance');

      // Ensure that only onwer can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
      console.log("----");
      console.log("Ensure that only onwer can issue tokens");
      console.log("----");

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });
      console.log("----");
      console.log("unstake token!");
      console.log("----");

      // Check results after unstaking
      result = await daiToken.balanceOf(investor);
      console.log("DAITOKEN BALANCE AFTER UNSTAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      console.log("TOKENFARM BALANCE AFTER UNSTAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking');

      result = await tokenFarm.stakingBalance(investor);
      console.log("STAKING BALANCE AFTER UNSTAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking');

      result = await tokenFarm.isStaking(investor)
      console.log("STATUS STAKING", result);
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})
