import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMemo, useSyncExternalStore } from "react";
import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

const MASONRY_COLS = 4;
const SM_BREAKPOINT = "(min-width: 640px)";

function useIsSmUp() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(SM_BREAKPOINT);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(SM_BREAKPOINT).matches,
    () => false,
  );
}

interface GalleryMasonryProps {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
}

export function GalleryMasonry({ images, onOpen }: Readonly<GalleryMasonryProps>) {
  const isSmUp = useIsSmUp();

  const columns = useMemo(() => {
    const cols: { image: ValidGalleryImage; globalIndex: number }[][] = Array.from({ length: MASONRY_COLS }, () => []);
    images.forEach((img, i) => cols[i % MASONRY_COLS].push({ image: img, globalIndex: i }));
    return cols;
  }, [images]);

  if (!isSmUp) {
    return (
      <div className="mx-auto grid w-full grid-cols-1 gap-4 overflow-hidden">
        {images.map((image, i) => {
          const ratio = image.asset.metadata?.dimensions?.aspectRatio ?? 1;
          return (
            <AspectRatio key={image.asset._id} ratio={ratio} className="overflow-hidden rounded-xl">
              <GalleryItem image={image} index={i} onItemClick={onOpen} className="w-full h-full rounded-none!" loading="eager" />
            </AspectRatio>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 overflow-hidden">
      {columns.map((col, colIndex) => (
        <div key={"masonry-col-" + colIndex} className="grid gap-4 md:gap-6">
          {col.map(({ image, globalIndex }) => {
            const ratio = image.asset.metadata?.dimensions?.aspectRatio ?? 1;
            return (
              <AspectRatio key={image.asset._id} ratio={ratio} className="overflow-hidden rounded-xl">
                <GalleryItem
                  image={image}
                  index={globalIndex}
                  onItemClick={onOpen}
                  className="w-full h-full rounded-none!"
                  loading="eager"
                />
              </AspectRatio>
            );
          })}
        </div>
      ))}
    </div>
  );
}
