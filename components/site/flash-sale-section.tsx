'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from './product-card';
import { SectionHeader } from './section-header';
import { countdown } from '@/lib/format';
import { useLanguage } from '@/lib/language-context';
import type { Product } from '@/lib/types';

export function FlashSaleSection({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(i);
  }, []);

  if (!products.length) return null;
  const endsAt = products[0].flash_sale_ends_at ?? new Date(Date.now() + 8 * 3600_000).toISOString();
  // reference tick so countdown re-computes
  void tick;
  const cd = countdown(endsAt);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="glass-card overflow-hidden p-0">
        {/* header band */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-border/60 bg-gradient-to-r from-secondary/10 via-transparent to-secondary/10 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-gold text-white shadow-md">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold md:text-2xl">{t('flashSale')}</h2>
              <p className="text-xs text-muted-foreground">{t('tagline')}</p>
            </div>
          </div>
          {!cd.done && (
            <div className="flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-sm shadow-sm">
              <Timer className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">{t('endsIn')}:</span>
              <div className="flex items-center gap-1 font-mono font-bold tabular-nums">
                <span className="rounded bg-foreground px-1.5 py-0.5 text-xs text-background">{String(cd.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="rounded bg-foreground px-1.5 py-0.5 text-xs text-background">{String(cd.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="rounded bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground">{String(cd.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {/* products */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.slice(0, 10).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
