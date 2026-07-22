'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, BadgePercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

export function HeroBanner() {
  const { t, locale } = useLanguage();

  const features = [
    { icon: Truck, label: locale === 'ar' ? 'توصيل سريع' : 'Fast Delivery' },
    { icon: ShieldCheck, label: locale === 'ar' ? 'منتجات أصلية' : 'Authentic Products' },
    { icon: BadgePercent, label: t('cashOnDelivery') },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 gradient-cedar" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,162,39,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        {/* text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-gold-light" />
            <span>{locale === 'ar' ? 'مجموعة مختارة بعناية' : 'Handpicked collection'}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80 md:text-lg">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gradient-gold rounded-full text-white shadow-lg hover:opacity-90">
              <Link href="/categories">
                {t('shopNow')} <ArrowRight className="ltr:ml-2 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link href="/search?sort=deals">{t('exploreDeals')}</Link>
            </Button>
          </div>

          {/* features */}
          <div className="mt-10 flex flex-wrap gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                <f.icon className="h-5 w-5 text-gold-light" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* image collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden h-80 md:block lg:h-96"
        >
          <div className="absolute left-0 top-4 h-48 w-44 overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl lg:w-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Headphones" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-4 top-0 h-56 w-48 overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl lg:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Fashion" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-12 h-44 w-40 overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl lg:w-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/1112597/pexels-photo-1112597.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Lamp" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-6 right-0 h-40 w-36 overflow-hidden rounded-2xl border-4 border-gold/40 shadow-2xl lg:w-44">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Beauty" className="h-full w-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
