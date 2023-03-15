const handleLogOut = async () => {
  const discoveryEndpoint = new URL(
    "/.well-known/openid-configuration",
    // not-null assertion because error gets thrown above if OIDC_ISSUER is undefined
    "https://login.inrupt.com"
  );
  try {
    const response = await fetch(discoveryEndpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const responseJson = await response.json();
    window.location = responseJson.end_session_endpoint;
  } catch (error) {
    alert(error);
  }
};

export default handleLogOut;
