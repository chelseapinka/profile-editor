import Button from "@mui/material/Button";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useSession } from "@inrupt/solid-ui-react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  addUrl,
  createSolidDataset,
  getThing,
  getWebIdDataset,
  saveSolidDatasetAt,
  setThing,
  ThingPersisted,
} from "@inrupt/solid-client";
import invariant from "tiny-invariant";
import { Typography } from "@mui/material";

const NewProfileView = () => {
  const { session } = useSession();
  const { webId } = session.info;
  const [containerAddress, setContainerAddress] = useState<string>("");
  const [profileName, setProfileName] = useState<string>("");

  const handleNewProfile = async (): Promise<ThingPersisted | undefined> => {
    const profileAddress = `${containerAddress}${profileName}`;
    try {
      invariant(
        webId,
        "webId must be set to create a new profile and save it to your Pod"
      );
      await saveSolidDatasetAt(profileAddress, createSolidDataset(), {
        fetch: session.fetch,
      });
      // TODO this part could not be tested because this specific app is not on the ESS allow list to edit WebID Profiles.
      // This code below can be debugged to get to the final solution.
      const webIdProfile = await getWebIdDataset(webId);
      invariant(
        webIdProfile,
        "webIdProfile must be defined to save Profile information to WebIDProfile"
      );
      const webIdThing = getThing(webIdProfile, webId);
      invariant(
        webIdThing,
        "webIdThing must be defined to add Profile to list of profiles"
      );

      const updatedThing = addUrl(
        webIdThing,
        // foaf.primaryTopic doesn't exactly match what is in the webIdProfile
        "http://xmlns.com/foaf/0.1/#isPrimaryTopicOf",
        profileAddress
      );
      const updatedDataset = setThing(webIdProfile, updatedThing);
      // unsure how to set the WebIdProfile, below is just a guess
      await saveSolidDatasetAt(webId, updatedDataset, {
        fetch: session.fetch,
      });
      return updatedThing;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid2 container direction="column" spacing={4}>
      <Grid2>
        <Typography textAlign="center" variant="h4">
          I want to create a new profile
        </Typography>
      </Grid2>
      <Grid2>
        <TextField
          onChange={(e) => setContainerAddress(e.target.value)}
          value={containerAddress}
          label="Where do you want to create profile?"
          fullWidth
        />
      </Grid2>
      <Grid2>
        <TextField
          onChange={(e) => setProfileName(e.target.value)}
          value={profileName}
          label="What would you like to call your profile?"
          fullWidth
        />
      </Grid2>
      <Grid2>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          fullWidth
          onClick={handleNewProfile}
        >
          Create
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default NewProfileView;
