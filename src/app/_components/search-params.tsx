import { parseAsString, createLoader, parseAsBoolean } from "nuqs/server";

export const postSearchParams = {
  q: parseAsString,
  signin: parseAsBoolean,
  post_id: parseAsString,
  post_edit_id: parseAsString,
  comment: parseAsBoolean,
};

export const loadSearchParams = createLoader(postSearchParams);
