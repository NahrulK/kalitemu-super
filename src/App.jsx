/* eslint-disable react/forbid-prop-types */
import { Preloader } from "components/common";
import PropType from "prop-types";
import React, { StrictMode, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "routers/AppRouter";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AppContext } from "context/app-context";

const promise = loadStripe(
  "pk_test_51KyVBgJHCE1fmy6FlGIETPjz7Nflk8XaqKkcMuaYaXAHAMqJCN2X5QGOCGWfwMzGW3VDFyRX5JZKyS1VDQZA9czg00pcZXZBVe"
);

const App = ({ store, persistor }) => {
  const treeData = [
    {
      title: "Lombok Timur",
      value: "Lombok Timur",
      children: [
        {
          title: "Terara",
          value: "Terara",
          children: [
            {
              title: "Jenggik - Rp.10.000",
              value: 10000,
            },
            {
              title: "Rarang - Rp.8.000",
              value: 8000,
            },
          ],
        },
        {
          title: "Sikur",
          value: "Sikur",
          children: [
            {
              title: "Paok Motong - Rp.12.000",
              value: 12000,
            },
            {
              title: "Kotaraja - Rp.9.000",
              value: 9000,
            },
          ],
        },
      ],
    },
    {
      title: "Lombok Barat",
      value: "Lombok Barat",
      children: [
        {
          title: "Gerung",
          value: "Gerung",
          children: [
            {
              title: "Babussalam - Rp.50.000",
              value: 50000,
            },
            {
              title: "Banyu Urip - Rp.55.000",
              value: 55000,
            },
          ],
        },
        {
          title: "Kediri",
          value: "Kediri",
          children: [
            {
              title: "Banyumulek - Rp.60.000",
              value: 60000,
            },
            {
              title: "Dasan Baru - Rp.70.000",
              value: 70000,
            },
          ],
        },
      ],
    },
  ];

  const [ongkir, setOngkir] = useState(0);

  const appContextValue = {
    dataOngkir: treeData,
    setOngkir,
    ongkir,
  };

  return (
    <StrictMode>
      <AppContext.Provider value={appContextValue}>
        <Provider store={store}>
          <PersistGate loading={<Preloader />} persistor={persistor}>
            <Elements stripe={promise}>
              <AppRouter />
            </Elements>
          </PersistGate>
        </Provider>
      </AppContext.Provider>
    </StrictMode>
  );
};

App.propTypes = {
  store: PropType.any.isRequired,
  persistor: PropType.any.isRequired,
};

export default App;
