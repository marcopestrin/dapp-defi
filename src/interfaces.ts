export interface Token {
    methods?: any,
    _address?: string,
}
export interface MainProps {
  staking: boolean,
  sendToken: (amount:number) => void,
}
export interface BalanceProps {
  daiToken: string,
  dappToken: string,
  staking: string
}
export interface WithdrawProps {
  unstakeTokens: () => void
}
export interface NavbarProps {
    account: string,
}
