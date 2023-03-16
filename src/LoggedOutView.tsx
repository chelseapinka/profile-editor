import Button from "@mui/material/Button";
import React, { ReactElement, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSession } from "@inrupt/solid-ui-react";
import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { getIdpsFromWebId } from "./utils/getIdpsFromWebId";
import { Box } from "@mui/system";
import Divider from "@mui/material/Divider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LoggedOutView = () => {
  const { session } = useSession();
  const [webIdInput, setWebIdInput] = useState<string>("");
  const [loginWithWebId, setLoginWithWebID] = useState<boolean>(false);
  const [idpsFromWebIdProfile, setIdpsFromWebIdProfile] = useState<string[]>(
    []
  );

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

  const renderIdpOptions = () => {
    if (idpsFromWebIdProfile.length) {
      let buttons: ReactElement[] = idpsFromWebIdProfile.map((idp) => {
        return (
          <Box my={2}>
            <Button
              onClick={() => handleLogin(idp)}
              variant="contained"
              key={idp}
            >
              {`Login with ${idp}`}
              <ArrowForwardIcon sx={{ pl: "5px" }} />
            </Button>
          </Box>
        );
      });
      return <div>{buttons}</div>;
    }

    if (loginWithWebId && !idpsFromWebIdProfile.length)
      return (
        <Typography>
          There was an error discovering the IDP associated with this WebID.
        </Typography>
      );
  };

  return (
    <Box justifyContent="center">
      <Box mx={4} py={3}>
        <Typography variant="h1" textAlign="center">
          Welcome to the profile editor. Please log in to continue editing your
          profiles.
        </Typography>
      </Box>
      <Grid2 container justifyContent="space-evenly" spacing={8}>
        <Grid2 flexDirection="column">
          <Grid2>
            <Typography variant="h4">Have a WebID with PodSpaces? </Typography>
          </Grid2>

          <Button
            onClick={() => handleLogin("https://login.inrupt.com")}
            variant="contained"
            fullWidth
          >
            Sign In with PodSpaces
          </Button>
        </Grid2>
        <Grid2>
          <Divider orientation="vertical" />
        </Grid2>

        <Grid2 flexDirection="column">
          <Grid2>
            <Typography variant="h4">Or enter your WebID</Typography>
          </Grid2>
          <TextField
            variant="standard"
            onChange={(e) => {
              setWebIdInput(e.target.value);
            }}
            value={webIdInput}
            fullWidth
          />
          <Grid2>
            <Button
              onClick={async () => {
                const idps = (await getIdpsFromWebId(webIdInput)) || [];
                setLoginWithWebID(true);
                setIdpsFromWebIdProfile(idps);
              }}
              variant="contained"
              fullWidth
            >
              Get IDP from WebID Profile
            </Button>
          </Grid2>
          {renderIdpOptions()}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default LoggedOutView;
