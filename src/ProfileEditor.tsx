import { equals } from "ramda";
import saveProfile from "./utils/saveProfile";
import { US_STATES } from "./states";
import useProfile from "./hooks/useProfile";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import invariant from "tiny-invariant";
import MenuItem from "@mui/material/MenuItem";
import React, { memo, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSession } from "@inrupt/solid-ui-react";
import ProfileSelector from "./ProfileSelector";
import { Link, Typography } from "@mui/material";
import LoggedOutView from "./LoggedOutView";
import NewProfileView from "./NewProfileView";
import handleLogOut from "./utils/handleLogOut";

type Props = ReturnType<typeof useProfile>;

const ProfileEditor = (props: Props) => {
  const {
    email,
    loading,
    name,
    postalAddress,
    profileUrls,
    selectedProfileUrl,
  } = props;

  const { session } = useSession();
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
      invariant(
        selectedProfileUrl,
        "selectedProfileUrl must be set to save a profile"
      );

      const newProfile = {
        ...formValues,
        postalAddress: nextPostalAddress,
        url: selectedProfileUrl,
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session.info.isLoggedIn) {
    return <LoggedOutView />;
  }

  if (profileUrls && profileUrls.length > 1 && !selectedProfileUrl) {
    return <ProfileSelector />;
  }

  return (
    <Box mt={2} display="flex" flexDirection="row">
      <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            variant="filled"
            defaultValue={name}
            autoComplete="name"
            name="name"
            fullWidth
            label="Name"
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <input
          type="hidden"
          name="postalAddress.url"
          value={postalAddress?.url}
        />
        <Grid item xs={12} sm={12}>
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
        </Grid>
        <Grid item xs={8} sm={8}>
          <TextField
            variant="filled"
            defaultValue={postalAddress?.city}
            autoComplete="address-level2"
            name="postalAddress.city"
            required
            fullWidth
            label="City"
          />
        </Grid>
        <Grid item xs={4} sm={4}>
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
        </Grid>
        <Grid item xs={12} sm={12}>
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
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button size="large" variant="contained" fullWidth type="submit">
            Save
          </Button>
          {showSuccess && (
            <Typography>Profile updated successfully!</Typography>
          )}
          <Link
            rel="noopener noreferrer"
            href={selectedProfileUrl}
            target="_blank"
          >
            "View your profile here"
          </Link>
          <Button
            size="large"
            variant="contained"
            fullWidth
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <NewProfileView />
      </Grid>
    </Box>
  );
};

const MemoizedProfileForm = memo(ProfileEditor, equals);

const WrappedProfileForm = () => {
  const profileData = useProfile();

  return <MemoizedProfileForm {...profileData} />;
};

export default WrappedProfileForm;
