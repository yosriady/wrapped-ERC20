import React, { Component } from "react";
import { ToastContainer } from 'react-toastify'
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
        <ToastContainer />

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
            <strong>PAY Allowance for Wrapping: </strong>
            <ContractData contract="PAY" method="allowance" methodArgs={[currentAccount, ExchangeAddress]}/>
          </p>
         <p>
            <strong>Approve PAY</strong>          
            <ContractForm contract="PAY" method="approve" />
          </p>
        </div>

        <div className="section">
          <h2>WPAY</h2>
          <p>Deployed at <a href={WPAYEtherscan}>{WPAYAddress}</a></p>
          <p>
            <strong>WPAY Balance: </strong>
            <ContractData contract="WPAY" method="balanceOf" methodArgs={[currentAccount]}/>
          </p>
          <p>
            <strong>WPAY Allowance for Unwrapping: </strong>
            <ContractData contract="WPAY" method="allowance" methodArgs={[currentAccount, ExchangeAddress]}/>
          </p>
         <p>
            <strong>Approve WPAY</strong>             
            <ContractForm contract="WPAY" method="approve" />
          </p>
        </div>    


          <div className="section">
          <h2>WPAY Exchange</h2>
          <p>Deployed at <a href={ExchangeEtherscan}>{ExchangeAddress}</a></p>
          <p>
            <strong>Total PAY wrapped: </strong>
            <ContractData contract="WPAYExchange" method="supply" />
          </p>

          <p>
            <strong>Wrap PAY</strong>
            <ContractForm contract="WPAYExchange" method="deposit" />
          </p>

          <p>
            <strong>Unwrap WPAY</strong>
            <ContractForm contract="WPAYExchange" method="withdraw" />
          </p>  
        </div>
      </div>
    );
  }
}