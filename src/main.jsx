import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { normalize, setupPage } from "csstips";

normalize();
setupPage("#root");

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
