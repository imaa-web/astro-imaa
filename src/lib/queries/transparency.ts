import { defineQuery } from "groq";
import { DETAILED_BASE_PAGE_FRAGMENT, HERO_FRAGMENT, PORTABLE_TEXT_FRAGMENT, SLUG_FRAGMENT } from "./fragments";

const DOWNLOADABLE_FILE_FRAGMENT = `
  _key,
  title,
  label,
  "fileUrl": asset->url,
  "fileName": asset->originalFilename,
`;

const TRANSPARENCY_PROJECT_FRAGMENT = `
  _key,
  title,
  origin,
  value,
  status,
  documents[] { ${DOWNLOADABLE_FILE_FRAGMENT} },
`;

// Dados da página portal (/transparencia) — document page com slug "transparencia"
export const TRANSPARENCY_INDEX_PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == "transparencia"][0] {
    ${DETAILED_BASE_PAGE_FRAGMENT}
  }
`);

const TRANSPARENCY_SECTION_FRAGMENT = `
  _id,
  title,
  ${SLUG_FRAGMENT},
  ${HERO_FRAGMENT},
  partner,
  excerpt,
  description[] { ${PORTABLE_TEXT_FRAGMENT} },
  projects[] { ${TRANSPARENCY_PROJECT_FRAGMENT} },
  documents[] { ${DOWNLOADABLE_FILE_FRAGMENT} },
`;

export const ALL_TRANSPARENCY_SECTIONS_QUERY = defineQuery(`
  *[_type == "transparencySection"] | order(order asc) {
    ${TRANSPARENCY_SECTION_FRAGMENT}
  }
`);

export const TRANSPARENCY_SECTION_BY_SLUG_QUERY = defineQuery(`
  *[_type == "transparencySection" && slug.current == $slug][0] {
    ${TRANSPARENCY_SECTION_FRAGMENT}
  }
`);
