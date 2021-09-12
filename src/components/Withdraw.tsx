import React, { MouseEvent} from "react";
import { WithdrawProps } from "../interfaces";

const Withdraw = ({ unstakeTokens }: WithdrawProps) => {

    const handleWithdraw = (event: MouseEvent) => {
        event.preventDefault();
        unstakeTokens();
    }

    return (
        <button className="btn btn-link btn-block btn-sm" onClick={handleWithdraw} >
            Withdraw all tokens
        </button>
    );
}

export default Withdraw;