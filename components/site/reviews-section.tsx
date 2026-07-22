'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const reviews = [
  { name: 'Layla A.', country: 'UAE', rating: 5, text: 'Fast delivery and the quality exceeded my expectations. Cash on delivery made it so convenient.' },
  { name: 'Omar K.', country: 'Saudi Arabia', rating: 5, text: 'Cedar is now my go-to. Great prices, authentic products, and the packaging was premium.' },
  { name: 'Mona S.', country: 'Egypt', rating: 4, text: 'Loved the beauty products. Arrived in 3 days and the customer support was very helpful.' },
  { name: 'James R.', country: 'USA', rating: 5, text: 'The electronics section is fantastic. Got my headphones at a great discount during the flash sale.' },
  { name: 'Fatima Z.', country: 'Qatar', rating: 5, text: 'Beautiful app, easy to use in Arabic, and the COD option is perfect for me. Highly recommend.' },
  { name: 'Ahmed M.', country: 'Kuwait', rating: 4, text: 'Good variety and competitive prices. The order tracking kept me informed the whole way.' },
];

export function ReviewsSection() {
  const { t, locale } = useLanguage();
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center gap-3"
      >
        <span className="h-7 w-1.5 rounded-full gradient-gold" />
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{t('customerReviews')}</h2>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
            className="glass-card relative p-5"
          >
            <Quote className="absolute top-4 ltr:right-4 rtl:left-4 h-8 w-8 text-primary/10" />
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className={`h-4 w-4 ${s < r.rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
            <p className="text-sm text-foreground/80">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-cedar text-sm font-bold text-white">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.country}{locale === 'ar' ? ' • عميل موثق' : ' • Verified buyer'}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
