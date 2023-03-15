import useProfile from "./hooks/useProfile";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NewProfileView from "./NewProfileView";
import handleLogOut from "./utils/handleLogOut";
import { Typography } from "@mui/material";

const ProfileSelector = () => {
  const { profileUrls, setSelectedProfileUrl } = useProfile();

  return (
    <Box>
      <Grid2 container display="flex" direction="row">
        <Grid2 width={"50%"}>
          <Typography>Which profile would you like to edit?</Typography>
          {profileUrls.map((profile: string) => {
            return (
              <Button
                key={profile}
                size="large"
                variant="contained"
                fullWidth
                onClick={() => setSelectedProfileUrl(profile)}
              >
                {profile}
              </Button>
            );
          })}
        </Grid2>
        <Grid2 width={"50%"}>
          <NewProfileView />
        </Grid2>
        <Button
          size="large"
          variant="contained"
          fullWidth
          onClick={() => handleLogOut()}
        >
          Log Out
        </Button>
      </Grid2>
    </Box>
  );
};

export default ProfileSelector;
