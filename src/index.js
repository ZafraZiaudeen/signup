import React from "react";
import ReactDOM from "react-dom/client";
import { PersistGate } from 'redux-persist/integration/react'
import "./index.css";
import App from "./App";
import Privacy from "./screens/Privacy";
import VerifyEmail from "./screens/VerifyEmail";
import DownloadData from "./screens/DownloadData";
import DropOffHandleScreen from "./screens/DropOffHandleScreen";
import SubscriptionFailedScreen from "./screens/SubscriptionFailed";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import rootReducer from "./reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {store, persistor} from "./redux/configureStore";




//configure store
// const store = createStore(
//   rootReducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/download-data" element={<DownloadData />} />
            <Route path="/drop-off" element={<DropOffHandleScreen />} />
            <Route path="/subscription-failed" element={<SubscriptionFailedScreen />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
