'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

const faqs = {
  en: [
    { q: 'How does Cash on Delivery work?', a: 'You pay in cash when your order arrives at your door. No need for a credit card or online payment — simply hand the exact amount to the courier upon delivery.' },
    { q: 'Which countries does Cedar deliver to?', a: 'We currently deliver across the UAE, Saudi Arabia, Egypt, Kuwait, Qatar, Bahrain, Oman, Jordan, and the United States. Delivery times vary by location.' },
    { q: 'How long does delivery take?', a: 'Delivery typically takes 1-6 business days depending on your country and city. You will see the estimated delivery window at checkout based on your address.' },
    { q: 'Are the products authentic?', a: 'Yes. Every product on Cedar is sourced from verified suppliers and brands. We stand behind the authenticity of every item we ship.' },
    { q: 'Can I return a product?', a: 'Yes. We offer a 7-day return policy for most items. If your product is damaged or not as described, contact our support team to initiate a return.' },
    { q: 'How do I track my order?', a: 'Once your order is shipped, you will receive a notification. You can track the status of your order anytime from the Orders page in your account.' },
  ],
  ar: [
    { q: 'كيف يعمل الدفع عند الاستلام؟', a: 'تدفع نقداً عند وصول طلبك إلى باب منزلك. لا حاجة لبطاقة ائتمان أو دفع إلكتروني — فقط سلم المبلغ للمندوب عند التوصيل.' },
    { q: 'إلى أي دول يوصل سيدار؟', a: 'نوصل حالياً عبر الإمارات والسعودية ومصر والكويت وقطر والبحرين وعمان والأردن والولايات المتحدة. تختلف أوقات التوصيل حسب الموقع.' },
    { q: 'كم يستغرق التوصيل؟', a: 'يستغرق التوصيل عادةً من 1 إلى 6 أيام عمل حسب دولتك ومدينتك. سترى نافذة التوصيل المتوقعة عند الدفع بناءً على عنوانك.' },
    { q: 'هل المنتجات أصلية؟', a: 'نعم. كل منتج على سيدار مصدره موردين وماركات موثقون. نضمن أصالة كل عن نشحنه.' },
    { q: 'هل يمكنني إرجاع منتج؟', a: 'نعم. نوفّر سياسة إرجاع لمدة 7 أيام لمعظم المنتجات. إذا كان منتجك تالفاً أو غير مطابق للوصف، تواصل مع فريق الدعم لبدء الإرجاع.' },
    { q: 'كيف أتتبع طلبي؟', a: 'بمجرد شحن طلبك ستصلك إشعار. يمكنك تتبع حالة طلبك في أي وقت من صفحة الطلبات في حسابك.' },
  ],
};

export function FaqSection() {
  const { t, locale } = useLanguage();
  const items = faqs[locale];
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{t('faq')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === 'ar' ? 'كل ما تحتاج معرفته عن التسوق مع سيدار' : 'Everything you need to know about shopping with Cedar'}
        </p>
      </div>
      <Accordion type="single" collapsible className="glass-card space-y-2 p-4">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/60 px-2 last:border-0">
            <AccordionTrigger className="text-start text-sm font-medium hover:no-underline md:text-base">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-6 text-center">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/faq">{locale === 'ar' ? 'المزيد من الأسئلة الشائعة' : 'More FAQs'} →</Link>
        </Button>
      </div>
    </section>
  );
}
