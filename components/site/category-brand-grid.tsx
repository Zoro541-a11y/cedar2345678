'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import type { Category, Brand } from '@/lib/types';

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center gap-3"
      >
        <span className="h-7 w-1.5 rounded-full gradient-cedar" />
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{t('shopByCategory')}</h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2) }}
          >
            <Link
              href={`/categories/${c.slug}`}
              className="glass-card group flex flex-col items-center gap-2 p-3 transition-all hover:shadow-[0_8px_30px_rgb(15,94,58,0.12)]"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted ring-2 ring-transparent transition-all group-hover:ring-primary/40 md:h-20 md:w-20">
                {c.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image_url} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                )}
              </div>
              <span className="line-clamp-1 text-center text-xs font-medium transition-colors group-hover:text-primary md:text-sm">
                {c.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function BrandGrid({ brands }: { brands: Brand[] }) {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center gap-3"
      >
        <span className="h-7 w-1.5 rounded-full gradient-gold" />
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{t('topBrands')}</h2>
      </motion.div>
      <div className="glass-card grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/search?brand=${b.slug}`}
            className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-accent"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted">
              {b.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logo_url} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-primary">{b.name.charAt(0)}</span>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium transition-colors group-hover:text-primary">{b.name}</p>
              {b.country && <p className="text-[10px] text-muted-foreground">{b.country}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
