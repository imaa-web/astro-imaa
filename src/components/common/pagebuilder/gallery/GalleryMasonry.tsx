import { useMemo } from "react";
import type { GalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

const MASONRY_COLS = 3;

interface Props {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}

export function GalleryMasonry({ images, onOpen }: Readonly<Props>) {
  const columns = useMemo(() => {
    const cols: { image: GalleryImage; globalIndex: number }[][] = Array.from({ length: MASONRY_COLS }, () => []);
    images.forEach((img, i) => cols[i % MASONRY_COLS].push({ image: img, globalIndex: i }));
    return cols;
  }, [images]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
      {columns.map((col, colIndex) => (
        <div key={"masonry-col-" + colIndex} className="grid gap-4 md:gap-6">
          {col.map(({ image, globalIndex }) => {
            const ratio = image.asset?.metadata?.dimensions?.aspectRatio ?? 1;
            return (
              <div key={image.asset!._id} style={{ aspectRatio: ratio }}>
                <GalleryItem image={image} index={globalIndex} onClick={onOpen} className="w-full h-full" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
