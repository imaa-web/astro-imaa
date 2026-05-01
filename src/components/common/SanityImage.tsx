import type { SanityImageBase } from "@/lib/sanity-derived-types";
import { SanityImage as LibSanityImage } from "sanity-image";

interface SanityImageProps {
  image: SanityImageBase;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
  /** Override the fit mode. Defaults to "cover" when width+height are set, "contain" otherwise. */
  mode?: "cover" | "contain";
  /**
   * Extra query params passed directly to the Sanity Image API.
   * Use for quality overrides, format forcing, sharpness, etc.
   * Example: { q: 90, sharp: 20 }
   * See: https://www.sanity.io/docs/image-urls
   */
  queryParams?: Record<string, string | number | boolean>;
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  className,
  sizes,
  loading = "lazy",
  style,
  mode,
  queryParams,
}: Readonly<SanityImageProps>) {
  const SANITY_PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const SANITY_DATASET = import.meta.env.PUBLIC_SANITY_DATASET;
  if (!SANITY_PROJECT_ID || !SANITY_DATASET || !image?.asset?._id) {
    if (import.meta.env.DEV && (!SANITY_PROJECT_ID || !SANITY_DATASET)) {
      console.warn("SanityImage: Variáveis de ambiente não configuradas.");
    }
    if (import.meta.env.DEV && !image?.asset?._id) {
      console.warn("SanityImage: image.asset._id não configurado ou inválido.");
    }
    return null;
  }

  return (
    <LibSanityImage
      id={image.asset._id}
      projectId={SANITY_PROJECT_ID}
      dataset={SANITY_DATASET}
      hotspot={image.hotspot as { x: number; y: number } | undefined}
      crop={image.crop as { top: number; bottom: number; left: number; right: number } | undefined}
      preview={image.asset.metadata?.lqip || undefined}
      width={width}
      height={height}
      alt={alt || image.alt || ""}
      className={className}
      sizes={sizes || "(max-width: 800px) 100vw, 800px"}
      loading={loading}
      mode={mode ?? (width && height ? "cover" : "contain")}
      style={style}
      queryParams={queryParams}
    />
  );
}
