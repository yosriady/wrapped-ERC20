import Web3 from "web3";
import PAY from "./abis/PAY.json";
import WPAY from "./abis/WPAY.json";

const options = {
  contracts: [PAY, WPAY],
  events: {
    PAY: ["Approval", "Transfer"],
    WPAY: ["Approval", "Transfer"]
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
