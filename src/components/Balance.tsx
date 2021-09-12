import React from "react";
import { BalanceProps } from "../interfaces";

const Balance = ({ daiToken, dappToken, staking }: BalanceProps) => {
  return (
    <table className="table table-borderless text-muted text-center">
        <thead>
            <tr>
                <th scope="col">Staking Balance</th>
                <th scope="col">Reward Balance</th>
                <th scope="col">Ether Balance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{window.web3.utils.fromWei(staking, 'Ether')} mDAI already staked</td>
                <td>{window.web3.utils.fromWei(dappToken, 'Ether')} DAPP</td>
                <td>{window.web3.utils.fromWei(daiToken, 'Ether')} Ether available</td>
            </tr>
        </tbody>
    </table>
  );
}

export default Balance;