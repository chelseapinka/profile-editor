import { useSession } from "@inrupt/solid-ui-react";
import { Navigate } from "react-router-dom";
import useProfile from "./hooks/useProfile";
import LoggedOutView from "./LoggedOutView";

function App() {
  const { session } = useSession();
  const { profileUrls, selectedProfileUrl } = useProfile();

  if (
    session.info.isLoggedIn &&
    profileUrls.length > 1 &&
    !selectedProfileUrl
  ) {
    return <Navigate to="/profile-selector" />;
  }
  if (
    (session.info.isLoggedIn && profileUrls && profileUrls.length === 1) ||
    (session.info.isLoggedIn && selectedProfileUrl)
  ) {
    return <Navigate to="/profile-editor" />;
  }
  return <LoggedOutView />;
}

export default App;
