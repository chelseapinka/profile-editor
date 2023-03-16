import { fromProfileThing } from "../utils/profileConverters";
import { useSession } from "@inrupt/solid-ui-react";
import {
  getAltProfileUrlAllFrom,
  getPodUrlAll,
  getProfileAll,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import invariant from "tiny-invariant";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type ProfileReturn = Partial<ReturnType<typeof fromProfileThing>> & {
  error?: TypeError;
  loading?: boolean;
  profileDatasets?: SolidDataset[];
  profileUrls?: string[];
  selectedProfileUrl?: string | undefined;
  setSelectedProfileUrl: Dispatch<SetStateAction<string>> | (() => void);
  storage?: string;
  webIdProfile?: SolidDataset;
};

function useProfile(): any {
  const { session } = useSession();
  const webId = session.info.webId;
  const [webIdProfile, setWebIdProfile] = useState<SolidDataset | undefined>(
    undefined
  );
  const [profileList, setProfileList] = useState<SolidDataset[]>([]);
  const [profileUrlsList, setProfileUrlsList] = useState<string[]>([]);
  const [storage, setStorage] = useState<string[]>([]);
  const [selectedProfileUrl, setSelectedProfileUrl] = useState<string>("");

  useEffect(() => {
    const gatherUserData = async () => {
      if (webId) {
        const storageUrls = await getPodUrlAll(webId);
        const profiles = await getProfileAll(webId);
        const profileUrls = await getAltProfileUrlAllFrom(
          webId,
          profiles.webIdProfile
        );
        console.log("how often does useeffect run?", { profileUrls });
        setWebIdProfile(profiles.webIdProfile);
        setProfileList(profiles.altProfileAll);
        setProfileUrlsList(profileUrls);
        setStorage(storageUrls);
        if (profileUrls.length === 1) setSelectedProfileUrl(profileUrls[0]);
      }
    };
    gatherUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webId]);

  const returnValue: ProfileReturn = {
    profileUrls: profileUrlsList,
    profileDatasets: profileList,
    storage: storage[0],
    selectedProfileUrl,
    setSelectedProfileUrl,
    webIdProfile,
  };

  if (profileList[0]) {
    const profileThing = getThing(profileList[0], selectedProfileUrl);
    const jsProfile = fromProfileThing(profileThing, profileList[0]);

    Object.assign(returnValue, jsProfile);
  }

  return returnValue;
}

export default useProfile;
