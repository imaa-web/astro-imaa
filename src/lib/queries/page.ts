import { defineQuery } from "groq";
import { DETAILED_BASE_PAGE_FRAGMENT } from "./fragments";

export const ALL_PAGES_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_createdAt desc) {
    ${DETAILED_BASE_PAGE_FRAGMENT}
  }
`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current == $slug][0] {
    ${DETAILED_BASE_PAGE_FRAGMENT}
  }
`);
