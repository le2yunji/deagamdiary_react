import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import AppWithStartScreen from "./AppWithStartScreen";
import "./index.css";
import { applyAssetStyleVariables } from "./utils/assetStyles";

applyAssetStyleVariables();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <AppWithStartScreen />
  </StrictMode>,
);
