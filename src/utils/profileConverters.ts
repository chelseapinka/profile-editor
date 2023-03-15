import {
  addUrl,
  getSourceUrl,
  getStringNoLocale,
  getUrl,
  removeAll,
  setStringNoLocale,
  setThing,
  setUrl,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import getOrCreateThing from "./getOrCreateThing";
import { rdf, schema } from "rdf-namespaces";

export type Profile = {
  postalAddress?: PostalAddress;
  email?: string;
  name?: string;
  url: string;
};

export type PostalAddress = {
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  url: string;
};
type PartialProfile = Partial<Profile> & { url: string };
type PartialPostalAddress = Partial<PostalAddress> & { url: string };

const setOrRemoveStringNoLocale = (
  thing: Thing,
  predicate: string,
  object?: string
) => {
  if (object) {
    return setStringNoLocale(thing, predicate, object);
  }
  return removeAll(thing, predicate);
};

export const fromProfileThing = (
  thing: Thing | null,
  dataset: SolidDataset
): Profile | undefined => {
  if (!thing) {
    return undefined;
  }
  const profile: Profile = {
    email: getStringNoLocale(thing, schema.email) || undefined,
    name: getStringNoLocale(thing, schema.name) || undefined,
    url: thing.url,
  };
  const postalAddressUrl = getUrl(thing, schema.address);
  if (postalAddressUrl) {
    const jsPostalAddress = fromPostalAddressThing(
      getOrCreateThing(dataset, postalAddressUrl)
    );
    if (jsPostalAddress) {
      profile.postalAddress = jsPostalAddress;
    }
  }

  return profile;
};

export const toProfileThing = (
  profile: PartialProfile,
  profileDataset: SolidDataset
): { thing: Thing; dataset: SolidDataset } => {
  let nextDataset = profileDataset;

  let profileThing = getOrCreateThing(nextDataset, profile.url);
  profileThing = setUrl(profileThing, rdf.type, schema.Person);

  profileThing = setOrRemoveStringNoLocale(
    profileThing,
    schema.email,
    profile.email
  );
  profileThing = setOrRemoveStringNoLocale(
    profileThing,
    schema.name,
    profile.name
  );

  const postalAddressReturn = toPostalAddressThing(
    profile.postalAddress,
    nextDataset
  );
  if (postalAddressReturn.thing) {
    profileThing = addUrl(
      profileThing,
      schema.address,
      postalAddressReturn.thing.url
    );
    nextDataset = postalAddressReturn.dataset;
  }

  nextDataset = setThing(nextDataset, profileThing);

  return { thing: profileThing, dataset: nextDataset };
};

export const toPostalAddressThing = (
  postalAddress: PartialPostalAddress | undefined,
  dataset: SolidDataset
): { thing: Thing | undefined; dataset: SolidDataset } => {
  if (!postalAddress || Object.keys(postalAddress).length === 0) {
    return {
      thing: undefined,
      dataset,
    };
  }
  let thing = getOrCreateThing(
    dataset,
    postalAddress.url || `${getSourceUrl(dataset)}#homeAddress`
  );
  thing = setUrl(thing, rdf.type, schema.PostalAddress);

  thing = setOrRemoveStringNoLocale(
    thing,
    schema.streetAddress,
    postalAddress.address
  );
  thing = setOrRemoveStringNoLocale(
    thing,
    schema.addressLocality,
    postalAddress.city
  );
  thing = setOrRemoveStringNoLocale(
    thing,
    schema.addressRegion,
    postalAddress.state
  );
  thing = setOrRemoveStringNoLocale(
    thing,
    schema.postalCode,
    postalAddress.zipcode
  );

  const nextDataset = setThing(dataset, thing);

  return {
    thing,
    dataset: nextDataset,
  };
};

export const fromPostalAddressThing = (
  thing?: Thing
): PostalAddress | undefined => {
  if (!thing) {
    return undefined;
  }

  return {
    address: getStringNoLocale(thing, schema.streetAddress) || undefined,
    city: getStringNoLocale(thing, schema.addressLocality) || undefined,
    state: getStringNoLocale(thing, schema.addressRegion) || undefined,
    url: thing.url,
    zipcode: getStringNoLocale(thing, schema.postalCode) || undefined,
  };
};
