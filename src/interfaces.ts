export interface Token {
    methods?: any,
    _address?: string,
}

export interface MainProps {
  daiTokenBalance: string,
  dappTokenBalance: string,
  stakingBalance: string,
  stakeTokens: (amount: number) => void,
  unstakeTokens: () => void,
}

export interface NavbarProps {
    account: string,
}
