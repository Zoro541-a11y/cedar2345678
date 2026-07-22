'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Heart,
  Star,
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductGallery } from './product-gallery';
import { ProductCard } from './product-card';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { effectivePrice, formatPrice, discountPercent, timeAgo } from '@/lib/format';
import type { Product, Review, Question } from '@/lib/types';

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: Props) {
  const { t, locale } = useLanguage();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { user } = useAuth();
  const supabase = getSupabaseBrowser();
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [questionForm, setQuestionForm] = useState('');
  const wished = has(product.id);
  const inStock = product.stock > 0;

  const price = effectivePrice(Number(product.price), product.discount_percentage);
  const off = discountPercent(Number(product.price), product.compare_at_price) || product.discount_percentage;

  useEffect(() => {
    (async () => {
      const [{ data: r }, { data: q }] = await Promise.all([
        supabase.from('reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false }),
        supabase.from('questions').select('*').eq('product_id', product.id).order('created_at', { ascending: false }),
      ]);
      setReviews((r ?? []) as Review[]);
      setQuestions((q ?? []) as Question[]);
    })();
  }, [product.id, supabase]);

  const onAdd = () => {
    if (!inStock) {
      toast.error(t('outOfStock'));
      return;
    }
    addItem(product, qty);
    toast.success(t('addToCart'));
  };

  const onBuyNow = () => {
    if (!inStock) {
      toast.error(t('outOfStock'));
      return;
    }
    addItem(product, qty);
    window.location.href = '/checkout';
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(locale === 'ar' ? 'سجّل الدخول أولاً' : 'Please sign in first');
      return;
    }
    if (!reviewForm.body.trim()) return;
    const { data } = await supabase
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: user.id,
        author_name: user.email,
        rating: reviewForm.rating,
        title: reviewForm.title,
        body: reviewForm.body,
        is_verified: true,
      })
      .select('*')
      .maybeSingle();
    if (data) {
      setReviews((p) => [data as Review, ...p]);
      setReviewForm({ rating: 5, title: '', body: '' });
      toast.success(locale === 'ar' ? 'تم نشر التقييم' : 'Review posted');
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(locale === 'ar' ? 'سجّل الدخول أولاً' : 'Please sign in first');
      return;
    }
    if (!questionForm.trim()) return;
    const { data } = await supabase
      .from('questions')
      .insert({
        product_id: product.id,
        user_id: user.id,
        author_name: user.email,
        question: questionForm,
      })
      .select('*')
      .maybeSingle();
    if (data) {
      setQuestions((p) => [data as Question, ...p]);
      setQuestionForm('');
      toast.success(locale === 'ar' ? 'تم إرسال السؤال' : 'Question submitted');
    }
  };

  const fbt = related.slice(0, 2);
  const fbtTotal = fbt.reduce((s, p) => s + effectivePrice(Number(p.price), p.discount_percentage), 0) + price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">{t('home')}</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="truncate font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* gallery */}
        <div className="lg:col-span-5">
          <ProductGallery media={product.media} name={product.name} />
        </div>

        {/* info */}
        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {product.badge && (
              <Badge className="mb-2 bg-secondary text-secondary-foreground">{product.badge}</Badge>
            )}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{product.name}</h1>

            {/* rating */}
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <span className="font-medium">{product.rating || '0.0'}</span>
              <span className="text-muted-foreground">· {product.reviews_count} {t('reviews')}</span>
              <span className="text-muted-foreground">· {product.sold_count} sold</span>
            </div>

            {/* price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
              {product.compare_at_price && Number(product.compare_at_price) > price && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(Number(product.compare_at_price))}</span>
              )}
              {off > 0 && <Badge className="bg-destructive text-destructive-foreground">-{off}%</Badge>}
            </div>

            {/* stock */}
            <p className="mt-2 flex items-center gap-1.5 text-sm">
              {inStock ? (
                <><CheckCircle2 className="h-4 w-4 text-primary" /><span className="text-primary font-medium">{t('inStock')} ({product.stock})</span></>
              ) : (
                <><span className="text-destructive font-medium">{t('outOfStock')}</span></>
              )}
            </p>

            {/* short desc */}
            <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

            {/* SKU / brand */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {product.sku && <div><span className="text-muted-foreground">{t('sku')}:</span> <span className="font-medium">{product.sku}</span></div>}
              {product.brand && <div><span className="text-muted-foreground">{t('brand')}:</span> <Link href={`/search?brand=${product.brand.slug}`} className="font-medium text-primary">{product.brand.name}</Link></div>}
            </div>

            {/* qty + actions */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><Plus className="h-4 w-4" /></Button>
              </div>
              <Button onClick={onAdd} disabled={!inStock} className="flex-1 rounded-full gradient-cedar text-white hover:opacity-90">
                <ShoppingCart className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('addToCart')}
              </Button>
              <Button onClick={onBuyNow} disabled={!inStock} className="rounded-full gradient-gold text-white hover:opacity-90">
                <Zap className="ltr:mr-1 rtl:ml-1 h-4 w-4" /> {t('buyNow')}
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => toggle(product.id)}>
                <Heart className={wished ? 'h-5 w-5 fill-destructive text-destructive' : 'h-5 w-5'} />
              </Button>
            </div>

            {/* trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Truck, label: locale === 'ar' ? 'توصيل سريع' : 'Fast delivery' },
                { icon: ShieldCheck, label: locale === 'ar' ? 'منتج أصلي' : 'Authentic' },
                { icon: RefreshCw, label: locale === 'ar' ? 'إرجاع 7 أيام' : '7-day returns' },
              ].map((b, i) => (
                <div key={i} className="glass-card flex flex-col items-center gap-1 p-3">
                  <b.icon className="h-5 w-5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* shipping sidebar */}
        <div className="lg:col-span-3">
          <div className="glass-card sticky top-24 space-y-3 p-5">
            <h3 className="font-semibold">{t('shipping')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /><span>{locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span></div>
              <p className="text-muted-foreground">{locale === 'ar' ? 'التوصيل خلال 1-6 أيام عمل حسب الدولة' : 'Delivery in 1-6 business days depending on country'}</p>
            </div>
            <div className="border-t border-border pt-3 text-sm">
              <p className="text-muted-foreground">{t('seller')}</p>
              <p className="font-medium">Cedar {t('brandName') === 'سيدار' ? 'متجر' : 'Store'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* tabs: description / specs / reviews / questions */}
      <div className="mt-10">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="description">{t('description')}</TabsTrigger>
            <TabsTrigger value="specifications">{t('specifications')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')} ({reviews.length})</TabsTrigger>
            <TabsTrigger value="questions">{t('questions')} ({questions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="glass-card prose prose-sm max-w-none p-5 dark:prose-invert">
              <p>{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications?.map((s, i) => (
                    <tr key={i} className={i % 2 ? 'bg-muted/30' : ''}>
                      <td className="w-1/3 px-4 py-2.5 font-medium">{s.key}</td>
                      <td className="px-4 py-2.5">{s.value}</td>
                    </tr>
                  ))}
                  {!product.specifications?.length && (
                    <tr><td className="px-4 py-6 text-center text-muted-foreground">No specifications</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-3">
                {reviews.length === 0 && <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-cedar text-xs font-bold text-white">{r.author_name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="text-sm font-medium">{r.author_name}</p>
                          {r.is_verified && <p className="text-[10px] text-primary">{t('verifiedPurchase')}</p>}
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </div>
                    {r.title && <p className="mt-2 font-medium text-sm">{r.title}</p>}
                    {r.body && <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">{timeAgo(r.created_at)}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={submitReview} className="glass-card space-y-3 p-4">
                <h4 className="font-semibold">{t('writeReview')}</h4>
                <div>
                  <label className="text-sm">{t('rating')}</label>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                        <Star className={`h-6 w-6 ${n <= reviewForm.rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/40'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Input placeholder="Title" value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} />
                <Textarea placeholder={locale === 'ar' ? 'اكتب تقييمك...' : 'Write your review...'} rows={3} value={reviewForm.body} onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))} />
                <Button type="submit" className="w-full rounded-full gradient-cedar text-white">{t('writeReview')}</Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-3">
                {questions.length === 0 && <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'لا توجد أسئلة بعد' : 'No questions yet'}</p>}
                {questions.map((q) => (
                  <div key={q.id} className="glass-card p-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{q.question}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{q.author_name} · {timeAgo(q.created_at)}</p>
                        {q.answer && (
                          <div className="mt-2 rounded-lg bg-accent p-3 text-sm">
                            <p className="flex items-center gap-1 text-xs font-medium text-primary"><ThumbsUp className="h-3 w-3" /> Answer</p>
                            <p className="mt-1">{q.answer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={submitQuestion} className="glass-card space-y-3 p-4">
                <h4 className="font-semibold">{t('askQuestion')}</h4>
                <Textarea placeholder={locale === 'ar' ? 'اكتب سؤالك...' : 'Ask your question...'} rows={4} value={questionForm} onChange={(e) => setQuestionForm(e.target.value)} />
                <Button type="submit" className="w-full rounded-full gradient-cedar text-white">{t('askQuestion')}</Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* frequently bought together */}
      {fbt.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold">{t('frequentlyBoughtTogether')}</h2>
          <div className="glass-card flex flex-col items-center gap-4 p-5 md:flex-row">
            <div className="flex items-center gap-2">
              {[product, ...fbt].map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="h-20 w-20 overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.media?.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
                </Link>
              ))}
            </div>
            <div className="text-center md:ltr:ml-auto md:rtl:mr-auto">
              <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'الإجمالي لـ 3 منتجات' : 'Total for 3 items'}</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(fbtTotal)}</p>
              <Button onClick={() => { addItem(product, 1); fbt.forEach((p) => addItem(p, 1)); toast.success(t('addToCart')); }} className="mt-2 rounded-full gradient-cedar text-white">
                {t('addToCart')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* related products */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
