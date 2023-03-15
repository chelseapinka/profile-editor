import { fetch } from "@inrupt/solid-client-authn-browser";
import { fromProfileThing, Profile, toProfileThing } from "./profileConverters";
import getOrCreateDataset from "./getOrCreateDataset";
import { getThing, saveSolidDatasetAt } from "@inrupt/solid-client";
import { mergeDeepRight } from "ramda";
import invariant from "tiny-invariant";

const saveProfile = async (profile: Profile) => {
  invariant(profile.url, "Profile url is required");
  const dataset = await getOrCreateDataset(profile.url, { fetch });

  const existingProfileThing = getThing(dataset, profile.url);
  const existingProfile = fromProfileThing(existingProfileThing, dataset) || {};

  const { dataset: newDataset } = toProfileThing(
    mergeDeepRight(existingProfile, profile),
    dataset
  );

  return await saveSolidDatasetAt(profile.url, newDataset, { fetch });
};

export default saveProfile;
