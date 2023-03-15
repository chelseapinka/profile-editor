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
import React, { memo } from "react";
import TextField from "@mui/material/TextField";

type Props = ReturnType<typeof useProfile>;

const ProfileForm = (props: Props) => {
  const {
    email,
    loading,
    name,
    postalAddress,
    selectedProfileUrl,
    setShowSuccess,
  } = props;

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

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2}>
      <Grid container spacing={3}>
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
          <Button
            size="large"
            color="secondary"
            variant="contained"
            fullWidth
            type="submit"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const MemoizedProfileForm = memo(ProfileForm, equals);

const WrappedProfileForm = () => {
  const profileData = useProfile();

  return <MemoizedProfileForm {...profileData} />;
};

export default WrappedProfileForm;
