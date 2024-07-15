import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { ApiProvider } from "@reduxjs/toolkit/query/react"
import { apiSlice } from "./features/api/apiSlice.js"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <App />
    </ApiProvider>
    <ToastContainer />
  </React.StrictMode>
)
