import { getBoolean, getDate, getDatetime, Thing } from "@inrupt/solid-client";

export const greedyGetDataFromThing = (thing: Thing, property: string) => {
  if (getBoolean(thing, property)) return getBoolean(thing, property);
  if (getDate(thing, property)) return getDate(thing, property);
  if (getDatetime(thing, property)) return getDateTime(thing, property);
};
