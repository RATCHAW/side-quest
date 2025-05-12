import { parseAsString, createLoader, parseAsBoolean } from "nuqs/server";

export const postSearchParams = {
  q: parseAsString,
  p: parseAsString,
  comment: parseAsBoolean,
};

export const loadSearchParams = createLoader(postSearchParams);
