import { defineQuery } from "groq";

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0] {
    heading,
    tagline,
    seoDescription,
    contactTabLabel,
    contactFormHeading,
    contactFormDescription,
    enrollmentActive,
    enrollmentTabLabel,
    enrollmentFormHeading,
    enrollmentFormDescription,
    "enrollmentFormFields": enrollmentFormFields[] {
      _key,
      fieldType,
      label,
      placeholder,
      inputType,
      required,
      width,
      "options": options[] {
        _key,
        label
      }
    }
  }
`);
