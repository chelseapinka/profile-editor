import {
  createSolidDataset,
  FetchError,
  getSolidDataset,
} from "@inrupt/solid-client";

type Params = Parameters<typeof getSolidDataset>;

const getOrCreateDataset = async (url: Params[0], options?: Params[1]) => {
  let dataset;

  try {
    dataset = await getSolidDataset(url, options);
  } catch (err: unknown) {
    if (!(err instanceof FetchError) || err.response.status !== 404) {
      throw err;
    }
    dataset = createSolidDataset();
  }

  return dataset;
};

export default getOrCreateDataset;
