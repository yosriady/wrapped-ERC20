import React, { Component } from "react";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";

import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

import store from './middleware';
import drizzleOptions from "./drizzleOptions";
import HomeContainer from "./HomeContainer";

class App extends Component {
  render() {
    return (
      <DrizzleProvider store={store} options={drizzleOptions}>
        <LoadingContainer>
          <HomeContainer />
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
