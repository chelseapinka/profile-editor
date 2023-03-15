import Button from "@mui/material/Button";
import React, { ReactElement, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSession } from "@inrupt/solid-ui-react";
import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { getIdpsFromWebId } from "./utils/getIdpsFromWebId";

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
          <Button
            onClick={() => handleLogin(idp)}
            variant="contained"
            key={idp}
          >{`Login with ${idp}`}</Button>
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
    <Grid2 container direction="column" spacing={4}>
      <Typography>Have a WebID? </Typography>
      <Button
        onClick={() => handleLogin("https://login.inrupt.com")}
        variant="contained"
      >
        Sign In with PodSpaces
      </Button>
      <Typography>Or enter your WebID to Sign into another server</Typography>
      <TextField
        variant="standard"
        onChange={(e) => {
          setWebIdInput(e.target.value);
        }}
        value={webIdInput}
      />

      <Button
        onClick={async () => {
          const idps = (await getIdpsFromWebId(webIdInput)) || [];
          setLoginWithWebID(true);
          setIdpsFromWebIdProfile(idps);
        }}
        variant="contained"
      >
        Get IDP from WebID Profile
      </Button>
      {renderIdpOptions()}
    </Grid2>
  );
};

export default LoggedOutView;
