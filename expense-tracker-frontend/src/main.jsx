
import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";


// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// React Toastify CSS
import "react-toastify/dist/ReactToastify.css";

// Custom CSS
import "./index.css";

import { ToastContainer } from "react-toastify";


ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <App />

        <ToastContainer
            position="top-right"
            autoClose={3000}
        />

    </React.StrictMode>

);
