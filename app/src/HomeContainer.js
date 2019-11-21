import HomePage from "./HomePage";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    SimpleStorage: state.contracts.SimpleStorage,
    TutorialToken: state.contracts.TutorialToken,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    network: state.web3.networkId,
    contracts: state.contracts,
  };
};

const HomeContainer = drizzleConnect(HomePage, mapStateToProps);

export default HomeContainer;
