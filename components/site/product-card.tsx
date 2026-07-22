'use client';

import Link from 'next/link';
import { Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useLanguage } from '@/lib/language-context';
import { effectivePrice, formatPrice, discountPercent } from '@/lib/format';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { t } = useLanguage();
  const image = product.media?.images?.[0] ?? '';
  const wished = has(product.id);
  const price = effectivePrice(Number(product.price), product.discount_percentage);
  const off = discountPercent(Number(product.price), product.compare_at_price) || product.discount_percentage;
  const inStock = product.stock > 0;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) {
      toast.error(t('outOfStock'));
      return;
    }
    addItem(product, 1);
    toast.success(t('addToCart'));
  };

  const onWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="glass-card relative overflow-hidden transition-all hover:shadow-[0_12px_40px_rgb(15,94,58,0.12)]">
          {/* image */}
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-muted">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
            )}

            {/* badges */}
            <div className="absolute top-2 flex flex-col gap-1 ltr:left-2 rtl:right-2">
              {off > 0 && (
                <Badge className="bg-destructive text-destructive-foreground shadow-sm">-{off}%</Badge>
              )}
              {product.is_flash_sale && (
                <Badge className="flex items-center gap-0.5 bg-secondary text-secondary-foreground shadow-sm">
                  <Zap className="h-3 w-3" /> Flash
                </Badge>
              )}
              {product.is_new && (
                <Badge className="bg-primary text-primary-foreground shadow-sm">New</Badge>
              )}
            </div>

            {/* wishlist */}
            <button
              onClick={onWish}
              aria-label="Toggle wishlist"
              className="absolute top-2 ltr:right-2 rtl:left-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-all hover:scale-110"
            >
              <Heart className={wished ? 'h-4 w-4 fill-destructive text-destructive' : 'h-4 w-4 text-muted-foreground'} />
            </button>
          </div>

          {/* content */}
          <div className="space-y-1.5 p-3">
            <p className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-primary">
              {product.name}
            </p>

            {/* rating */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="font-medium text-foreground">{product.rating || '0.0'}</span>
              <span>· {product.sold_count} sold</span>
            </div>

            {/* price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">{formatPrice(price)}</span>
              {product.compare_at_price && Number(product.compare_at_price) > price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(Number(product.compare_at_price))}
                </span>
              )}
            </div>

            {/* add button */}
            <Button
              onClick={onAdd}
              disabled={!inStock}
              size="sm"
              className="mt-1 w-full rounded-full gradient-cedar text-white hover:opacity-90 disabled:opacity-50"
            >
              <ShoppingCart className="ltr:mr-1.5 rtl:ml-1.5 h-3.5 w-3.5" />
              {inStock ? t('addToCart') : t('outOfStock')}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
