import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material/styles";
import ProfileEditor from "./ProfileEditor";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { theme } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfileSelector from "./ProfileSelector";
import Box from "@mui/material/Box";
import Header from "./Header";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <Header />
        <Box m="25px" display="flex" flexDirection="column">
          <BrowserRouter>
            <Routes>
              <Route index element={<App />} />
              <Route path="/profile-selector" element={<ProfileSelector />} />
              <Route path="/profile-editor" element={<ProfileEditor />} />
            </Routes>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </SessionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
