import { SanityImage as LibSanityImage } from "sanity-image";

import type { SanityImageBase } from "@/lib/sanity-derived-types";

const SANITY_PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = import.meta.env.PUBLIC_SANITY_DATASET;

interface Props {
  image: SanityImageBase;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  className,
  sizes,
  loading = "lazy",
}: Readonly<Props>) {
  if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
    throw new Error("SanityImage: PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set.");
  }
  if (!image?.asset?._id) return null;

  return (
    <LibSanityImage
      id={image.asset._id}
      projectId={SANITY_PROJECT_ID}
      dataset={SANITY_DATASET}
      hotspot={image.hotspot || undefined}
      crop={image.crop || undefined}
      preview={image.asset.metadata?.lqip || undefined}
      width={width}
      height={height}
      alt={alt || image.alt || ""}
      className={className}
      sizes={sizes || "(max-width: 800px) 100vw, 800px"}
      loading={loading}
      mode={width && height ? "cover" : "contain"}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
      }}
    />
  );
}
