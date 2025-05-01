import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import { ThemeProvider } from "./components/theme/theme-provider"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="cricket-team-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
