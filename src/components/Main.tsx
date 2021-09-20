import React, { useState, FormEvent, ChangeEvent } from "react";
import dai from "../dai.png";
import { MainProps } from "../interfaces";

const Main = ({ sendToken, staking }: MainProps) => {

  const [ amount, setAmount ] = useState<string>("0");
  const [ description, setDescription ] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const amountToStake: number = window.web3.utils.toWei(amount, 'Ether');
    sendToken(amountToStake, description);
  }

  const handleAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log("controllare che questo sia di tipo stringa", value);
    setAmount(value);
  }

  const handleDescription = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log("controllare che questo sia di tipo stringa", value);
    setDescription(value);
  }

  const isValidInput = () => {
    return description !== "" && amount !== "0" && amount !== "";
  }

  return (
    <div id="content" className="mt-3">
      <div className="card mb-4" >
        <div className="card-body">
          <form className="mb-3" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <label className="float-left">
                <b>Amount to { staking ? "stake" : "unstaking" }:</b>
              </label>
            </div>
            <div className="input-group mb-4 form-group">
              <input type="text" className="form-control form-control-lg" placeholder="Description transaction" required onChange={handleDescription} />
            </div>
            <div className="input-group mb-4 form-group">
              <input type="text" className="form-control form-control-lg" placeholder="0" required onChange={handleAmount} />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={dai} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={!isValidInput}>
              { staking ? "Stake Tokens" : "Unstaking Tokens" }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Main;
