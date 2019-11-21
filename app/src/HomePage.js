import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "./components";

import logo from "./logo.png";

const WPAY_EXCHANGE_ADDRESS = '0x172f95f4e9E3C92dA07671DaD52Cea341d16B987'; // TODO

export default ({ accounts, contracts, network }) => (
  <div className="App">
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>WPAY Token Swap (networkID {network})</h1>
      <AccountData accountIndex={0} units="ether" precision={3} />
    </div>

    <div className="section">
      <h2>PAY</h2>
      <p>{}</p>
      <p>
        <strong>PAY Balance: </strong>
        <ContractData contract="PAYToken" method="balanceOf" methodArgs={[accounts[0]]}/>
      </p>
      <p>
        <strong>PAY Allowance: </strong>
        <ContractData contract="PAYToken" method="allowance" methodArgs={[accounts[0], WPAY_EXCHANGE_ADDRESS]}/>
      </p>
      <ContractForm contract="PAYToken" method="approve" />
    </div>

    <div className="section">
      <h2>WPAY</h2>
      <p>
        TODO
      </p>
    </div>    


      <div className="section">
      <h2>WPAY Exchange</h2>
      <p>
        TODO
      </p>
    </div>
  </div>
);
