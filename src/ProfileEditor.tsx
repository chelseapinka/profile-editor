import { equals } from "ramda";
import saveProfile from "./utils/saveProfile";
import { US_STATES } from "./states";
import useProfile from "./hooks/useProfile";
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

type Props = ReturnType<typeof useProfile>;

const ProfileEditor = (props: Props) => {
  const { session } = useSession();
  const navigate = useNavigate();

  const {
    email,
    name,
    postalAddress,
    selectedProfileUrl,
    setSelectedProfileUrl,
  } = props;

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(data.entries());
    const nextPostalAddress: Record<string, string> = {};

    Array.from(data.entries()).forEach(([key, val]) => {
      if (key.startsWith("postalAddress.") && typeof val === "string") {
        const postalAddressKey = key.replace("postalAddress.", "");
        // @ts-ignore -- key can be any value, which might not appear in postalAddress, which TS doesn't like
        const prevVal = postalAddress?.[postalAddressKey];

        if (prevVal || val) {
          nextPostalAddress[postalAddressKey] = val;
        }
      }
    });

    try {
      // invariant(
      //   selectedProfileUrl,
      //   "selectedProfileUrl must be set to save a profile"
      // );

      const newProfile = {
        ...formValues,
        postalAddress: nextPostalAddress,
        // TODO this shouldn't be hardcoded
        url: "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/profile",
      };

      // @ts-ignore -- TypeScript doesn't know that postalAddress will have a url on it.
      await saveProfile(newProfile);
      setShowSuccess(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : undefined);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => setShowSuccess(false), 4000);
    }
  }, [showSuccess]);

  const handleGoBackToProfileSelector = () => {
    setSelectedProfileUrl("");
    navigate("/profile-selector");
  };

  return (
    <Box justifyContent="center" display="flex">
      <Grid2
        container
        spacing={3}
        component="form"
        onSubmit={handleSubmit}
        flexDirection="row"
      >
        <Grid2 className="Form Grid">
          {/* <Grid2 container> */}
          <Grid2>
            <TextField
              required
              variant="filled"
              defaultValue={name}
              autoComplete="name"
              name="name"
              fullWidth
              label="Name"
            />
          </Grid2>
          <Grid2 xs={12}>
            <TextField
              required
              fullWidth
              variant="filled"
              defaultValue={email}
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
            />
          </Grid2>
          <input
            type="hidden"
            name="postalAddress.url"
            value={postalAddress?.url}
          />
          <Grid2 xs={12} sm={12}>
            <TextField
              variant="filled"
              defaultValue={postalAddress?.address}
              autoComplete="street-address"
              name="postalAddress.address"
              multiline
              required
              rows={3}
              fullWidth
              label="Address"
            />
          </Grid2>
          <Grid2 xs={8} sm={8}>
            <TextField
              variant="filled"
              defaultValue={postalAddress?.city}
              autoComplete="address-level2"
              name="postalAddress.city"
              required
              fullWidth
              label="City"
            />
          </Grid2>
          <Grid2 xs={4} sm={4}>
            <TextField
              variant="filled"
              defaultValue={postalAddress?.state || ""}
              autoComplete="address-level2"
              name="postalAddress.state"
              fullWidth
              label="State"
              required
              select
            >
              {US_STATES.map((state: string) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 xs={12} sm={12}>
            <TextField
              variant="filled"
              defaultValue={postalAddress?.zipcode}
              autoComplete="postal-code"
              name="postalAddress.zipcode"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]{5}-?([0-9]{4})?",
                title: "5 or 9 digit zip code",
              }}
              required
              fullWidth
              label="Zip"
            />
          </Grid2>
          <Grid2>
            <Grid2>
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
            </Grid2>
          </Grid2>
        </Grid2>
        {/* </Grid2> */}
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

const MemoizedProfileForm = memo(ProfileEditor, equals);

const WrappedProfileForm = () => {
  const profileData = useProfile();

  return <MemoizedProfileForm {...profileData} />;
};

export default WrappedProfileForm;
