// ============================================================================
// Image Types - Base types (manual, since structure is consistent across all image types)
// ============================================================================

import type { ALL_PAGES_QUERY_RESULT, SanityImageCrop, SanityImageHotspot } from "@/lib/sanity.types";

/** Sanity asset with projected metadata from GROQ queries */
export interface ProjectedSanityAsset {
  _id: string;
  url: string | null;
  altText?: string | null;
  metadata: {
    lqip: string | null;
    dimensions: {
      width: number | null;
      height: number | null;
      aspectRatio: number | null;
    } | null;
  } | null;
}

/** Base image type with projected asset - generic for any Sanity image */
export interface SanityImageBase {
  asset?: ProjectedSanityAsset | null;
  alt?: string | null;
  caption?: string | null;
  media?: unknown;
  hotspot?: SanityImageHotspot | null;
  crop?: SanityImageCrop | null;
}

// ============================================================================
// Page Builder derived types
// ============================================================================

export type PageBuilder = NonNullable<ALL_PAGES_QUERY_RESULT>[number]["pageBuilder"];
export type PageBuilderBlock = NonNullable<PageBuilder>[number];
export type PageBuilderBlockType = PageBuilderBlock["_type"];

export type PageBuilderBlockOf<T extends PageBuilderBlockType> = Extract<PageBuilderBlock, { _type: T }>;
