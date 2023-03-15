import { getThing, getUrlAll, getWebIdDataset } from "@inrupt/solid-client";
import { SOLID } from "@inrupt/vocab-solid";

const doesUserHaveWebIdProfile = async (webId: string): Promise<boolean> => {
  if (webId) {
    return window.fetch(webId, { method: "GET" }).then((res) => res.ok);
  } else return false;
};

export const getIdpsFromWebId = async (
  webId: string
): Promise<string[] | undefined> => {
  try {
    if (webId) {
      if (await doesUserHaveWebIdProfile(webId)) {
        const profile = await getWebIdDataset(webId);
        if (profile) {
          const webIdThing = getThing(profile, webId);
          if (webIdThing !== null) {
            const listOfIdps = getUrlAll(webIdThing, SOLID.oidcIssuer);
            return listOfIdps;
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
