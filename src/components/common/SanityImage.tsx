import type { SanityImageBase } from "@/lib/sanity-derived-types";
import { useEffect, useRef } from "react";
import { SanityImage as LibSanityImage } from "sanity-image";

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
  style?: React.CSSProperties;
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
}: Readonly<Props>) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const img = wrapper.querySelector("img");
    if (!img) return;

    // iOS fix: se a imagem já está completa quando o componente monta,
    // o evento `load` já disparou antes do handler ser registrado.
    // Disparamos manualmente para que a lib processe a transição do lqip.
    if (img.complete && img.naturalWidth > 0) {
      img.dispatchEvent(new Event("load"));
    }
  }, []);

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
    <div ref={wrapperRef} style={{ display: "contents" }}>
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
        mode={width && height ? "cover" : "contain"}
        style={style}
      />
    </div>
  );
}
