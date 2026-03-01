import { defineQuery } from "groq";
import { CTA_FRAGMENT, IMAGE_FRAGMENT } from "./fragments";

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0] {
    title,
    excerpt,
    heroDescription,
    "logo": logo {
      ${IMAGE_FRAGMENT}
    },
    "primaryCta": primaryCta { ${CTA_FRAGMENT} },
    "secondaryCta": secondaryCta { ${CTA_FRAGMENT} },
  }
`);
