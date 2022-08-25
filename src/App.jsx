/* eslint-disable react/forbid-prop-types */
import { Preloader } from "components/common";
import PropType from "prop-types";
import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "routers/AppRouter";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const promise = loadStripe(
  "pk_test_51KyVBgJHCE1fmy6FlGIETPjz7Nflk8XaqKkcMuaYaXAHAMqJCN2X5QGOCGWfwMzGW3VDFyRX5JZKyS1VDQZA9czg00pcZXZBVe"
);

const App = ({ store, persistor }) => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Preloader />} persistor={persistor}>
        <Elements stripe={promise}>
          <AppRouter />
        </Elements>
      </PersistGate>
    </Provider>
  </StrictMode>
);

App.propTypes = {
  store: PropType.any.isRequired,
  persistor: PropType.any.isRequired,
};

export default App;
