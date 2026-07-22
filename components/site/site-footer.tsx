'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language-context';
import { CEDAR_NAME } from '@/lib/constants';

export function SiteFooter() {
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!');
    setEmail('');
  };

  const policyLinks = [
    { href: '/faq', label: t('faq') },
    { href: '/privacy', label: t('privacy') },
    { href: '/terms', label: t('terms') },
    { href: '/delivery-policy', label: t('deliveryPolicy') },
    { href: '/return-policy', label: t('returnPolicy') },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-card/50">
      {/* newsletter band */}
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-xl font-bold text-gradient-cedar">{t('subscribeNewsletter')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === 'ar'
                ? 'اشترك ليصلك كل جديد عن العروض والمنتجات الحصرية.'
                : 'Get exclusive deals and new arrivals delivered to your inbox.'}
            </p>
          </div>
          <form onSubmit={subscribe} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('yourEmail')}
              className="rounded-full"
            />
            <Button type="submit" className="gradient-cedar shrink-0 rounded-full text-white hover:opacity-90">
              <Send className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('subscribe')}
            </Button>
          </form>
        </div>
      </div>

      {/* main footer */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-cedar text-white">
              <span className="text-lg font-bold">C</span>
            </div>
            <span className="text-2xl font-bold text-gradient-cedar">{CEDAR_NAME}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t('tagline')}</p>
          <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@cedar.market</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +971 4 123 4567</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {locale === 'ar' ? 'دبي، الإمارات' : 'Dubai, UAE'}</p>
          </div>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:border-primary hover:text-primary"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">{t('aboutUs')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">{t('about')}</Link></li>
            <li><Link href="/contact" className="hover:text-primary">{t('contact')}</Link></li>
            <li><Link href="/categories" className="hover:text-primary">{t('categories')}</Link></li>
            <li><Link href="/search" className="hover:text-primary">{t('search')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">{t('customerService')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {policyLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-primary">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">{t('policies')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> {t('cashOnDelivery')}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary" /> {locale === 'ar' ? 'توصيل سريع' : 'Fast delivery'}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> {locale === 'ar' ? 'منتجات أصلية' : 'Authentic products'}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary" /> {locale === 'ar' ? 'دعم 24/7' : '24/7 support'}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {CEDAR_NAME}. {t('allRightsReserved')}.
      </div>
    </footer>
  );
}
