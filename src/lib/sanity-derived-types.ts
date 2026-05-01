// ============================================================================
// Image Types - Base types (manual, since structure is consistent across all image types)
// ============================================================================

import type { FilterByType, Get } from "@sanity/codegen";
import type {
  ALL_PAGES_QUERY_RESULT,
  ALL_TRANSPARENCY_SECTIONS_QUERY_RESULT,
  CONTACT_PAGE_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
  PAGE_BY_SLUG_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  TRANSPARENCY_INDEX_PAGE_QUERY_RESULT,
  TRANSPARENCY_SECTION_BY_SLUG_QUERY_RESULT,
} from "@/lib/sanity.types";

/** Sanity asset with projected metadata from GROQ queries */
export interface ProjectedSanityAsset {
  _id: string;
  url: string | null;
  altText?: string | null;
  metadata: {
    lqip?: string | null;
    dimensions: {
      width: number | null;
      height: number | null;
      aspectRatio: number | null;
    } | null;
  } | null;
}

/** Base image type with projected asset - generic for any Sanity image */
export interface SanityImageBase {
  _key?: string | null;
  asset?: ProjectedSanityAsset | null;
  alt?: string | null;
  caption?: string | null;
  media?: unknown;
  hotspot?: {
    x?: number | null;
    y?: number | null;
    width?: number | null;
    height?: number | null;
    _type?: string | null;
  } | null;
  crop?: {
    top?: number | null;
    bottom?: number | null;
    left?: number | null;
    right?: number | null;
    _type?: string | null;
  } | null;
}

// ============================================================================
// Page Builder derived types
// ============================================================================

export type PageBuilder = Get<ALL_PAGES_QUERY_RESULT, number, "pageBuilder">;
export type PageBuilderBlock = NonNullable<PageBuilder>[number];
export type PageBuilderBlockType = PageBuilderBlock["_type"];

export type PageBuilderBlockOf<T extends PageBuilderBlockType> = FilterByType<
  PageBuilderBlock,
  T
>;

// ============================================================================
// Page Query derived types
// ============================================================================

export type HomePageQuery = HOME_PAGE_QUERY_RESULT;
export type ContactPageQuery = CONTACT_PAGE_QUERY_RESULT;
export type AllPagesQuery = ALL_PAGES_QUERY_RESULT;
export type PageBySlugQuery = PAGE_BY_SLUG_QUERY_RESULT;
export type TransparencyIndexPageQuery = TRANSPARENCY_INDEX_PAGE_QUERY_RESULT;
export type TransparencySectionsQuery = ALL_TRANSPARENCY_SECTIONS_QUERY_RESULT;
export type TransparencySectionBySlugQuery = TRANSPARENCY_SECTION_BY_SLUG_QUERY_RESULT;

// ============================================================================
// Menu Types - derived from TypeGen query results
// ============================================================================

export type SiteSettingsQuery = NonNullable<SITE_SETTINGS_QUERY_RESULT>;
export type SeoSettings = Pick<SiteSettingsQuery, "defaultSeoDescription" | "logo">;
export type QueryMainMenu = Get<SiteSettingsQuery, "mainMenu">;
export type QueryFooterMenu = Get<SiteSettingsQuery, "footerMenu">;
export type QuerySocialLinks = Get<SiteSettingsQuery, "socialLinks">;

/** Menu item from mainMenu or footerMenu queries */
export type QueryMenuItems = Get<QueryMainMenu, "items">;
export type QueryMenuItem = Get<QueryMenuItems, number>;
export type QueryFooterMenuItems = Get<QueryFooterMenu, "items">;
export type QueryFooterMenuItem = Get<QueryFooterMenuItems, number>;

// ============================================================================
// Social & Contact Types - derived from TypeGen
// ============================================================================

/** Social link from site settings */
export type QuerySocialLink = Get<QuerySocialLinks, number>;

/** Available social platforms */
export type SocialMediaPlatforms = NonNullable<QuerySocialLink["platform"]>;

/** Social link with optional cover image (used in SocialGrid on home page) */
export type QuerySocialLinkWithImage = QuerySocialLink & {
  image?: SanityImageBase | null;
};

/** Contact info from site settings */
export type QueryContactInfo = Get<SiteSettingsQuery, "contactInfo">;

/** Individual phone item from contact info */
export type QueryPhoneItem = Get<QueryContactInfo, "phones", number>;

/** Individual email item from contact info */
export type QueryEmailItem = Get<QueryContactInfo, "emails", number>;

/** Keys of contact info */
export type QueryContactInfoKeys = keyof NonNullable<QueryContactInfo>;

/** Data type for each contact info key */
export type ContactInfoValue =
  NonNullable<QueryContactInfo>[QueryContactInfoKeys];

// ============================================================================
// Transparency Types - derived from TypeGen
// ============================================================================

export type TransparencySection = Get<TransparencySectionsQuery, number>;
export type TransparencyProject = Get<TransparencySection, "projects", number>;
export type TransparencyDocument = Get<TransparencySection, "documents", number>;
export type TransparencyProjectDocument = Get<TransparencyProject, "documents", number>;
export type TransparencyProjectStatus = Get<TransparencyProject, "status">;

// ============================================================================
// Home Page Types - derived from GROQ projection
// ============================================================================

export type HomePageCta = Get<HOME_PAGE_QUERY_RESULT, "primaryCta">;

export type HomeProjectsPreviewSection = Get<
  HOME_PAGE_QUERY_RESULT,
  "projectsPreview"
>;

export type HomeMissionSection = Get<HOME_PAGE_QUERY_RESULT, "missionSection">;

export type HomeBlockHighlightSection = Get<
  HOME_PAGE_QUERY_RESULT,
  "blockHighlightSection"
>;
