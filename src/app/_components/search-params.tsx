import { parseAsString, createLoader, parseAsBoolean } from "nuqs/server";

export const postSearchParams = {
  q: parseAsString,
  post_id: parseAsString,
  comment: parseAsBoolean,
};

export const loadSearchParams = createLoader(postSearchParams);
