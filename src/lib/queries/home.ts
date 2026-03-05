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
    "projectsPreview": projectsPreview {
      label,
      heading,
      "image": image { ${IMAGE_FRAGMENT} },
      projects[] {
        _key,
        title,
        description,
        accent
      },
    },
    "missionSection": missionSection {
      label,
      heading,
      headingHighlight,
      description,
      secondaryDescription,
      "image": image { ${IMAGE_FRAGMENT} },
      pillars[] {
        _key,
        icon,
        title,
        description,
        color
      },
    },
    "blockHighlightSection": blockHighlightSection {
      label,
      milestone,
      milestoneLabel,
      heading,
      body,
      footer,
    },
  }
`);
