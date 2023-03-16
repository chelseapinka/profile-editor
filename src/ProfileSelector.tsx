import useProfile from "./hooks/useProfile";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import NewProfileView from "./NewProfileView";
import { Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileSelector = () => {
  const { profileUrls, setSelectedProfileUrl, selectedProfileUrl } =
    useProfile();
  const navigate = useNavigate();

  const handleProfileSelect = (profile: string) => {
    setSelectedProfileUrl(profile);
    navigate("/profile-editor");
  };

  return (
    <Box justifyContent="center" display="flex" flexDirection="column">
      <Grid2 container justifyContent="space-evenly">
        <Grid2>
          <Box mx={4} py={3}>
            <Typography variant="h1" textAlign="center">
              We found more than one profile for that WebId. Which Profile would
              you like to edit?
            </Typography>
          </Box>
        </Grid2>
        <Grid2 container justifyContent="space-evenly" spacing={8}>
          <Grid2 flexDirection="column" flexGrow={1}>
            <Grid2>
              <Typography variant="h4" textAlign="center">
                Edit an existing profile:
              </Typography>
            </Grid2>
            <Grid2>
              {profileUrls.map((profile: string) => {
                return (
                  <Grid2>
                    <Button
                      key={profile}
                      size="large"
                      variant="contained"
                      onClick={() => handleProfileSelect(profile)}
                    >
                      {profile}
                    </Button>
                  </Grid2>
                );
              })}
            </Grid2>
          </Grid2>
          <Grid2>
            <Divider orientation="vertical" />
          </Grid2>
          <Grid2
            container
            flexDirection="column"
            flexGrow={1}
            justifyContent="space-evenly"
            spacing={8}
          >
            <Grid2>
              <NewProfileView />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ProfileSelector;
