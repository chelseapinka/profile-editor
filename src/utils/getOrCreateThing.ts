import { createThing, getThing } from "@inrupt/solid-client";

type Params = Parameters<typeof getThing>;

const getOrCreateThing = (
  solidDataset: Params[0],
  thingUrl: Params[1],
  options?: Params[2]
) => {
  return (
    getThing(solidDataset, thingUrl, options) ||
    createThing({ url: thingUrl.toString() })
  );
};

export default getOrCreateThing;
