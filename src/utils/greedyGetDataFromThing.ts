import {
  getBoolean,
  getDate,
  getDatetime,
  getDecimal,
  getInteger,
  getStringNoLocale,
  Thing,
} from "@inrupt/solid-client";

export const greedyGetDataFromThing = (thing: Thing, property: string) => {
  if (getStringNoLocale(thing, property))
    return getStringNoLocale(thing, property);
  if (getBoolean(thing, property)) return getBoolean(thing, property);
  if (getDate(thing, property)) return getDate(thing, property);
  if (getDatetime(thing, property)) return getDatetime(thing, property);
  if (getDecimal(thing, property)) return getDecimal(thing, property);
  if (getInteger(thing, property)) return getInteger(thing, property);
  return null;
};
