const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
  .use(require('chai-as-promised'))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm, transactionCount;

  before(async() => {
    // Load Contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // get the number of transactions of tokenFarm contract
    transactionCount = await tokenFarm.transactionCount();

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner });
  })

  describe('Mock DAI deployment', async() => {
    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe('Dapp Token deployment', async() => {
    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    })
  })

  describe('Token Farm deployment', async() => {
    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    })

    it('contract has tokens', async() => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async() => {
      let result

      // set mockup data for example
      const description = "my description here -- example";

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      console.log("DAITOKEN BALANCE BEFORE STAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
      result = await tokenFarm.stakeTokens(tokens('100'), transactionCount.toString(), description, { from: investor });
      console.log("stake token!");
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), transactionCount.toNumber() +1, 'Id is correct');
      assert.equal(event.hash, transactionCount, 'Hash is correct');
      assert.equal(event.description, description, 'Description is correct');
      assert.equal(event.author, investor, 'Author is correct');
 
      // test to failure: with wrong data
      result = await tokenFarm.stakeTokens(tokens('123'), transactionCount, '', { from: investor }).should.be.rejected;
      result = await tokenFarm.stakeTokens(tokens('123'), '', description, { from: investor }).should.be.rejected;
      result = await tokenFarm.stakeTokens(tokens('0'), transactionCount, description, { from: investor }).should.be.rejected;
      console.log("Test with wrong data done");

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
      console.log("issue tokens!");

      // Check balances after issuance
      result = await dappToken.balanceOf(investor);
      console.log("DAPPTOKEN BALANCE AFTER ISSUANCE", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance');

      // Ensure that only onwer can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
      console.log("Ensure that only onwer can issue tokens");

      // Unstake tokens
      await tokenFarm.unstakeTokens(tokens('90'), transactionCount.toString(), description, { from: investor });
      console.log("unstake tokens!", tokens('90'));

      // Check results after unstaking
      result = await daiToken.balanceOf(investor);
      console.log("DAITOKEN BALANCE AFTER UNSTAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('90'), 'investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      console.log("TOKENFARM BALANCE AFTER UNSTAKING", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('10'), 'Token Farm Mock DAI balance correct after staking');
      
      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })
      console.log("issue tokens!");

      result = await tokenFarm.withdrawTokens({ from: investor });
      console.log("withdraw all tokens");

      result = await tokenFarm.stakingBalance(investor);
      console.log("STAKING BALANCE AFTER WITHDRAW", result.toString(), result.toString().length);
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after widthdraw');

      result = await tokenFarm.isStaking(investor);
      console.log("STATUS STAKING", result);
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })

    // it('transaction list', async() => {
    //   const transaction = await tokenFarm.Transaction(transactionCount);
    //   console.log("---------------");
    //   console.log(transaction);
    //   console.log("---------------");
    // })

  })

})
