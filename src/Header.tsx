import Button from "@mui/material/Button";
import { useSession } from "@inrupt/solid-ui-react";
import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import { Box } from "@mui/system";

import handleLogOut from "./utils/handleLogOut";

const Header = () => {
  const { session } = useSession();

  const handleLogin = async (
    oidcIssuer: string | undefined = "https://login.inrupt.com",
    redirectUrl: string | undefined = window.location.href
  ) => {
    const config: ILoginInputOptions = {
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientName: "Profile Editor",
      oidcIssuer,
      redirectUrl,
    };
    await session.login(config);
  };

  return (
    <Box flexDirection="row">
      <Grid2
        container
        justifyContent="space-around"
        sx={{
          backgroundColor: "#0D6796",
        }}
      >
        <Grid2 display="flex">
          {session.info.isLoggedIn ? (
            <Grid2 alignSelf="center" justifyContent="center">
              <Typography variant="body2">{`Logged in as: ${session.info.webId}`}</Typography>
            </Grid2>
          ) : (
            <Grid2 alignSelf="center" justifyContent="center">
              <Typography variant="body2">Not logged in.</Typography>
            </Grid2>
          )}
        </Grid2>
        <Grid2>
          <Button size="large" fullWidth onClick={() => handleLogin()}>
            Log In
          </Button>
        </Grid2>
        <Grid2>
          <Button size="large" fullWidth onClick={() => handleLogOut()}>
            Log Out
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Header;
