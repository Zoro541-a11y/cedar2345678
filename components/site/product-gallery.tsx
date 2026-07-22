'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import type { ProductMedia } from '@/lib/types';

interface GalleryProps {
  media: ProductMedia;
  name: string;
}

export function ProductGallery({ media, name }: GalleryProps) {
  const images = media?.images ?? [];
  const video = media?.video;
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y });
  };

  const currentImage = images[active];

  return (
    <div className="flex flex-col gap-3">
      {/* main image */}
      <div
        className="glass-card relative aspect-square overflow-hidden"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
      >
        {currentImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-200"
            style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: 'scale(1.8)' } : undefined}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
        <div className="pointer-events-none absolute bottom-3 ltr:right-3 rtl:left-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
          <ZoomIn className="h-3 w-3" /> Hover to zoom
        </div>
      </div>

      {/* thumbnails */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              active === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
        {video && (
          <a
            href={video}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-transparent bg-muted text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            ▶ Video
          </a>
        )}
      </div>
    </div>
  );
}
