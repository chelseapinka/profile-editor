import Button from "@mui/material/Button";
import React, { ReactElement, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSession } from "@inrupt/solid-ui-react";
import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { getIdpsFromWebId } from "./utils/getIdpsFromWebId";
import LoggedOutView from "./LoggedOutView";
import ProfileSelector from "./ProfileSelector";
import useProfile from "./hooks/useProfile";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { session } = useSession();
  const { profileUrls, selectedProfileUrl } = useProfile();
  console.log("rendering Home", { session, profileUrls });

  if (
    session.info.isLoggedIn &&
    profileUrls &&
    profileUrls.length > 1 &&
    !selectedProfileUrl
  ) {
    return <Navigate to="/profile-editor" replace={true} />;
  }
  if (session.info.isLoggedIn && profileUrls && profileUrls.length === 1) {
    return <Navigate to="/profile-selector" replace={true} />;
  }
  return <LoggedOutView />;
};

export default Home;
