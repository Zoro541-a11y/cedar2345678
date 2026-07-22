'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  Moon,
  Sun,
  Languages,
  Bell,
  X,
  LayoutDashboard,
  LogOut,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/lib/language-context';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useAuth } from '@/lib/auth-context';
import { STORE_NAV } from '@/lib/constants';
import { CEDAR_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const { t, locale, toggle, dir } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, profile, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* announcement bar */}
      <div className="gradient-cedar text-white text-xs md:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center">
          <span className="font-medium">✦ {t('cashOnDelivery')} • {CEDAR_NAME} — {t('tagline')}</span>
        </div>
      </div>

      {/* main bar */}
      <div className="glass border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
          {/* mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-72">
              <SheetHeader>
                <SheetTitle className="text-gradient-cedar text-xl font-bold">Cedar</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {STORE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {item.label[locale]}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                {user ? (
                  <>
                    <Link href="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent">{t('orders')}</Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent">{t('profile')}</Link>
                    <Link href="/notifications" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent">{t('notifications')}</Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-accent">{t('admin')}</Link>
                    )}
                    <button onClick={() => { signOut(); setMobileOpen(false); }} className="rounded-lg px-3 py-2.5 text-start text-sm text-destructive hover:bg-accent">{t('logout')}</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent">{t('login')}</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent">{t('register')}</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-cedar text-white shadow-md">
              <span className="text-lg font-bold">C</span>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-gradient-cedar sm:block">
              Cedar
            </span>
          </Link>

          {/* search */}
          <form onSubmit={onSearch} className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="h-10 rounded-full border-border/70 bg-background/80 ltr:pl-9 ltr:pr-4 rtl:pr-9 rtl:pl-4"
            />
          </form>

          {/* actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* language */}
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Switch language" className="relative">
              <Languages className="h-5 w-5" />
              <span className="absolute -bottom-0.5 ltr:right-0.5 rtl:left-0.5 text-[9px] font-bold text-primary">
                {locale === 'en' ? 'ع' : 'EN'}
              </span>
            </Button>

            {/* theme */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            {/* wishlist */}
            <Link href="/wishlist" className="relative" aria-label={t('wishlist')}>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishCount > 0 && (
                  <Badge className="absolute -top-1 ltr:-right-1 rtl:-left-1 h-4 min-w-4 justify-center rounded-full bg-secondary p-0 px-1 text-[10px] text-secondary-foreground">
                    {wishCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* cart */}
            <Link href="/cart" className="relative" aria-label={t('cart')}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 ltr:-right-1 rtl:-left-1 h-4 min-w-4 justify-center rounded-full bg-primary p-0 px-1 text-[10px] text-primary-foreground">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* notifications (auth) */}
            {user && (
              <Link href="/notifications" className="relative hidden sm:block" aria-label={t('notifications')}>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* user menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label={t('profile')}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-gold text-xs font-bold text-white">
                      {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{profile?.full_name || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/profile"><User className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('profile')}</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/orders"><Package className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('orders')}</Link></DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild><Link href="/admin"><LayoutDashboard className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('admin')}</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    <LogOut className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                <Button asChild variant="ghost" size="sm"><Link href="/login">{t('login')}</Link></Button>
                <Button asChild size="sm" className="gradient-cedar text-white hover:opacity-90"><Link href="/register">{t('register')}</Link></Button>
              </div>
            )}
          </div>
        </div>

        {/* desktop nav */}
        <nav className="hidden border-t border-border/40 md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
            {STORE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary',
                  'after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100'
                )}
              >
                {item.label[locale]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
