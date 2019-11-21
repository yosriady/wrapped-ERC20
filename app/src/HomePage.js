import React, { Component } from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "./components";
import { 
  getContractAddress,
  getNetworkName
} from './utils';

import logo from "./logo.png";

const WPAY_EXCHANGE_ADDRESS = '0x172f95f4e9E3C92dA07671DaD52Cea341d16B987'; // TODO

export default class HomePage extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    const { accounts, contracts, networkId } = this.props;
    const PAYAddress = getContractAddress('PAY', networkId);
    const WPAYAddress = getContractAddress('WPAY', networkId);
    const networkName = getNetworkName(networkId);
    const subdomains = {
      "1": "",
      "4": "rinkeby."
    }
    const PAYEtherscan = `https://${subdomains[networkId]}etherscan.io/address/${PAYAddress}`;
    const WPAYEtherscan = `https://${subdomains[networkId]}etherscan.io/address/${WPAYAddress}`;

    return (
      <div className="App">
        <div>
          <img src={logo} alt="drizzle-logo" />
          <h1>WPAY Token Swap (networkName)</h1>
          <AccountData accountIndex={0} units="ether" precision={3} />
        </div>

        <div className="section">
          <h2>PAY</h2>
          <p>Deployed at <a href={PAYEtherscan}>{PAYAddress}</a></p>
          <p>
            <strong>PAY Balance: </strong>
            <ContractData contract="PAY" method="balanceOf" methodArgs={[accounts[0]]}/>
          </p>
          <p>
            <strong>PAY Allowance: </strong>
            <ContractData contract="PAY" method="allowance" methodArgs={[accounts[0], WPAY_EXCHANGE_ADDRESS]}/>
          </p>
          <ContractForm contract="PAY" method="approve" />
        </div>

        <div className="section">
          <h2>WPAY</h2>
          <p>Deployed at <a href={WPAYEtherscan}>{WPAYAddress}</a></p>
          <p>
            <strong>WPAY Balance: </strong>
            <ContractData contract="WPAY" method="balanceOf" methodArgs={['0x172f95f4e9E3C92dA07671DaD52Cea341d16B987']}/>
          </p>
          <p>
            <strong>WPAY Allowance: </strong>
            <ContractData contract="WPAY" method="allowance" methodArgs={[accounts[0], WPAY_EXCHANGE_ADDRESS]}/>
          </p>
          <ContractForm contract="WPAY" method="approve" />
        </div>    


          <div className="section">
          <h2>WPAY Exchange</h2>
          <p>
            TODO
          </p>
        </div>
      </div>
    );
  }
}