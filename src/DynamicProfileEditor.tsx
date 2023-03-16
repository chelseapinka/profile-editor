import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import invariant from "tiny-invariant";
import MenuItem from "@mui/material/MenuItem";
import React, { memo, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Divider, Link, Typography } from "@mui/material";
import NewProfileView from "./NewProfileView";
import { useNavigate } from "react-router-dom";
import { useSession } from "@inrupt/solid-ui-react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import useProfile from "./hooks/useProfile";
import { getSolidDataset, SolidDataset, Thing } from "@inrupt/solid-client";
import { greedyGetDataFromThing } from "./utils/greedyGetDataFromThing";

const DynamicProfileEditor = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [profileDataset, setProfileDataset] = useState<
    SolidDataset | undefined
  >();
  const [fields, setFields] = useState<Thing[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGoBackToProfileSelector = () => {
    // remove selected profile
    navigate("/profile-selector");
  };
  const selectedProfileUrl =
    "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/profile";

  const getProfileData = async () => {
    const dataset = await getSolidDataset(
      "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/profile",
      { fetch: session.fetch }
    );
    setProfileDataset(dataset);
  };

  useEffect(() => {
    if (session.info.isLoggedIn) {
      getProfileData();
      console.log("in useEffect", { profileDataset });
    }
  }, [session]);

  const renderProfileForm = () => {
    return fields.map((field, i) => {
      // we need to use this function because we don't know what type of data each field is
      const label =
        greedyGetDataFromThing(
          field,
          "http://www.w3.org/2000/01/rdf-schema#label"
        ) || field.toString();
      return (
        <Grid2>
          <TextField
            variant="filled"
            //   defaultValue={}
            name=""
            fullWidth
            label={label}
          />
        </Grid2>
      );
    });
  };

  return (
    <Box>
      <Grid2 container flexDirection="row">
        <Grid2>
          <Grid2>{renderProfileForm()}</Grid2>
          <Grid2>
            <Link
              rel="noopener noreferrer"
              href="https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/profile"
              // href={selectedProfileUrl}
              target="_blank"
            >
              View your profile here
            </Link>
          </Grid2>
        </Grid2>
        <Grid2>
          <Button
            size="large"
            fullWidth
            type="submit"
            color="secondary"
            variant="contained"
          >
            Save
          </Button>
        </Grid2>
        <Grid2>
          {showSuccess && (
            <Typography>Profile updated successfully!</Typography>
          )}
        </Grid2>
        <Grid2>
          <Button
            size="large"
            color="secondary"
            variant="contained"
            fullWidth
            onClick={handleGoBackToProfileSelector}
          >
            Go to Profile Selector
          </Button>
        </Grid2>

        <Grid2 className="Divider Grid">
          <Divider orientation="vertical" />
        </Grid2>
        <Grid2 spacing={3} className="New Profile Grid">
          <NewProfileView />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DynamicProfileEditor;
