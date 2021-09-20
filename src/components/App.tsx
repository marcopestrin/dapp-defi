import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
import Main from "./Main";
import Withdraw from "./Withdraw";
import Balance from "./Balance";
import { Token } from "../interfaces";

const DaiToken = require("../abis/DaiToken.json");
const DappToken = require("../abis/DappToken.json");
const TokenFarm = require("../abis/TokenFarm.json");

const App = () => {

  const [ account, setAccount ] = useState<string>("0x0");
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ daiToken, setDaiToken ] = useState<Token>({});
  const [ dappToken, setDappToken ] = useState<Token>({});
  const [ tokenFarm, setTokenFarm ] = useState<Token>({});
  const [ daiTokenBalance, setDaiTokenBalance ] = useState<string>("0");
  const [ dappTokenBalance, setDappTokenBalance ] = useState<string>("0");
  const [ stakingBalance, setStakingBalance ] = useState<string>("0");

  useEffect(() => {
    startApp();
  }, []);

  const startApp = async() => {
    await loadWeb3();
    await loadTokens();
    return true;
  };

  const loadWeb3 = async() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      return;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return;
    }
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  };

  const stakeTokens = (amount: number, description: string) => {
    setLoading(true);
    console.log("info", { amount, account, address: tokenFarm._address});
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash: string) => {
      console.log("Hash after approve but before staking:", hash);
      tokenFarm.methods.stakeTokens(amount, hash, description)
        .send({ from: account })
        .on('transactionHash', async(hash: string) => {
          console.log("Hash after staking:", hash);
          await loadTokens();
          setLoading(false);
        });
    });
  }

  const unstakeTokens = (amount: number, description: string) => {
    setLoading(true);
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash: string) => {
      tokenFarm.methods.unstakeTokens(amount, hash, description)
        .send({ from: account })
        .on('transactionHash', async(hash: string) => {
          await loadTokens();
          setLoading(false);
        });
    });
  }

  const withdrawTokens = () => {
      setLoading(true);
      tokenFarm.methods.withdrawTokens()
        .send({ from: account })
        .on('transactionHash', async(hash: string) => {
          await loadTokens();
          setLoading(false);
        });
    }

    
  const loadTokens = async() => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const account = accounts[0] ? accounts[0].toString() : "0x0";
    setAccount(account);

    // Load DaiToken
    const daiTokenData = await DaiToken.networks[networkId];

    console.log({daiTokenData, networkId, DaiToken })
    if(daiTokenData) {
      const daiToken = await new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      const daiTokenBalance = await daiToken.methods.balanceOf(account).call();
      await setDaiToken(daiToken);
      setDaiTokenBalance(daiTokenBalance.toString());
    } else {
      window.alert('DaiToken contract not deployed to detected network.');
      return;
    }

    // Load DappToken  
    const dappTokenData: {[index: string]:any} = DappToken.networks[networkId];
    if(dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
      const dappTokenBalance = await dappToken.methods.balanceOf(account).call();
      setDappToken(dappToken);
      setDappTokenBalance(dappTokenBalance.toString());
    } else {
      window.alert('DappToken contract not deployed to detected network.');
      return;
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if(tokenFarmData) {
      const farmToken = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      const stakingBalance = await farmToken.methods.stakingBalance(account).call();
      setTokenFarm(farmToken);
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert('TokenFarm contract not deployed to detected network.');
      return;
    }

   setLoading(false);
  }

  const ContentToRender = () => {
    return (
      <>
        { loading
          ? <p id="loader" className="text-center">Loading...</p>
          : <>
            <Balance
              daiToken={daiTokenBalance}
              dappToken={dappTokenBalance}
              staking={stakingBalance}
            />
            <Main
                staking={true}
                sendToken={stakeTokens}
            />
            <Main
                staking={false}
                sendToken={unstakeTokens}
            />
            <Withdraw
                unstakeTokens={withdrawTokens}
            />
          </>
        }
      </>
    )
  }

  return (
    <>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <ContentToRender />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
export default App;