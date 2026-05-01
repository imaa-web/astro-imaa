import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

interface GalleryGridProps {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
  cols: 2 | 3;
}

const gridClassByCols: Record<GalleryGridProps["cols"], string> = {
  2: "grid grid-cols-1 gap-4 sm:grid-cols-2",
  3: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};

export function GalleryGrid({ images, onOpen, cols }: Readonly<GalleryGridProps>) {
  return (
    <div className={gridClassByCols[cols]}>
      {images.map((image, i) => (
        <div key={image.asset._id} className="aspect-square">
          <GalleryItem image={image} index={i} onItemClick={onOpen} className="w-full h-full" loading="eager" />
        </div>
      ))}
    </div>
  );
}
