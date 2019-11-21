import Web3 from "web3";
import PAY from "./abis/PAYToken.json";

const options = {
  contracts: [PAY],
  events: {
    PAY: ["Approval"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
