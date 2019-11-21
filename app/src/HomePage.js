import React, { Component } from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "./components";
import { 
  getContractInfo,
  getNetworkName
} from './utils';

import logo from "./logo.png";

export default class HomePage extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    const { accounts, contracts, networkId } = this.props;
    const currentAccount = accounts[0];
    const { address: PAYAddress, etherscan: PAYEtherscan } = getContractInfo('PAY', networkId);
    const { address: WPAYAddress, etherscan: WPAYEtherscan } = getContractInfo('WPAY', networkId);
    const { address: ExchangeAddress, etherscan: ExchangeEtherscan } = getContractInfo('WPAYExchange', networkId);
    const networkName = getNetworkName(networkId);

    return (
      <div className="App">
        <div>
          <img src={logo} alt="drizzle-logo" />
          <h1>WPAY Token Swap ({networkName})</h1>
          <AccountData accountIndex={0} units="ether" precision={3} />
        </div>

        <div className="section">
          <h2>PAY</h2>
          <p>Deployed at <a href={PAYEtherscan}>{PAYAddress}</a></p>
          <p>
            <strong>PAY Balance: </strong>
            <ContractData contract="PAY" method="balanceOf" methodArgs={[currentAccount]}/>
          </p>
          <p>
            <strong>PAY Allowance: </strong>
            <ContractData contract="PAY" method="allowance" methodArgs={[currentAccount, ExchangeAddress]}/>
          </p>
          <ContractForm contract="PAY" method="approve" />
        </div>

        <div className="section">
          <h2>WPAY</h2>
          <p>Deployed at <a href={WPAYEtherscan}>{WPAYAddress}</a></p>
          <p>
            <strong>WPAY Balance: </strong>
            <ContractData contract="WPAY" method="balanceOf" methodArgs={[currentAccount]}/>
          </p>
          <p>
            <strong>WPAY Allowance: </strong>
            <ContractData contract="WPAY" method="allowance" methodArgs={[currentAccount, ExchangeAddress]}/>
          </p>
          <ContractForm contract="WPAY" method="approve" />
        </div>    


          <div className="section">
          <h2>WPAY Exchange</h2>
          <p>Deployed at <a href={ExchangeEtherscan}>{ExchangeAddress}</a></p>
          <p>
            <strong>Total PAY wrapped: </strong>
            {/* <ContractData contract="WPAYExchange" method="supply" /> */}
          </p>
          {/* <ContractForm contract="WPAYExchange" method="deposit" />

          <ContractForm contract="WPAYExchange" method="withdraw" /> */}
        </div>
      </div>
    );
  }
}