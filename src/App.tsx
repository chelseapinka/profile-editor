import "./App.css";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import ProfileEditor from "./ProfileEditor";

function App() {
  return (
    <div className="App">
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <ProfileEditor />
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
}

export default App;
