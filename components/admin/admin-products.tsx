'use client';

import { useState } from 'react';
import { Plus, Pencil, Copy, Trash2, Download, Upload, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice, slugify } from '@/lib/format';
import type { Product, Category, Brand } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
}

interface FormState {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string;
  category_id: string;
  brand_id: string;
  price: string;
  compare_at_price: string;
  discount_percentage: string;
  stock: string;
  badge: string;
  is_featured: boolean;
  is_trending: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_flash_sale: boolean;
  meta_title: string;
  meta_description: string;
  images: string;
  video: string;
  specifications: string;
  is_active: boolean;
}

const emptyForm: FormState = {
  name: '', slug: '', sku: '', barcode: '', description: '', category_id: '', brand_id: '',
  price: '0', compare_at_price: '', discount_percentage: '0', stock: '0', badge: '',
  is_featured: false, is_trending: false, is_bestseller: false, is_new: false, is_flash_sale: false,
  meta_title: '', meta_description: '', images: '', video: '', specifications: '[]', is_active: true,
};

export function AdminProducts({ initialProducts, categories, brands }: Props) {
  const supabase = getSupabaseBrowser();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(emptyForm); setOpen(true); };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku ?? '',
      barcode: p.barcode ?? '',
      description: p.description ?? '',
      category_id: p.category_id ?? '',
      brand_id: p.brand_id ?? '',
      price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : '',
      discount_percentage: String(p.discount_percentage),
      stock: String(p.stock),
      badge: p.badge ?? '',
      is_featured: p.is_featured,
      is_trending: p.is_trending,
      is_bestseller: p.is_bestseller,
      is_new: p.is_new,
      is_flash_sale: p.is_flash_sale,
      meta_title: p.meta_title ?? '',
      meta_description: p.meta_description ?? '',
      images: (p.media?.images ?? []).join('\n'),
      video: p.media?.video ?? '',
      specifications: JSON.stringify(p.specifications ?? [], null, 2),
      is_active: p.is_active,
    });
    setOpen(true);
  };

  const duplicate = async (p: Product) => {
    const { data, error } = await supabase.from('products').insert({
      ...p,
      id: undefined,
      name: `${p.name} (copy)`,
      slug: `${p.slug}-copy-${Date.now().toString(36)}`,
      sku: p.sku ? `${p.sku}-COPY` : null,
      created_at: undefined,
      updated_at: undefined,
    }).select('*').maybeSingle();
    if (error) { toast.error('Failed to duplicate'); return; }
    if (data) setProducts((prev) => [data as Product, ...prev]);
    toast.success('Product duplicated');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
    let specs: { key: string; value: string }[] = [];
    try { specs = JSON.parse(form.specifications); } catch { specs = []; }
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      sku: form.sku || null,
      barcode: form.barcode || null,
      description: form.description,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      discount_percentage: Number(form.discount_percentage),
      stock: Number(form.stock),
      badge: form.badge || null,
      is_featured: form.is_featured,
      is_trending: form.is_trending,
      is_bestseller: form.is_bestseller,
      is_new: form.is_new,
      is_flash_sale: form.is_flash_sale,
      flash_sale_ends_at: form.is_flash_sale ? new Date(Date.now() + 8 * 3600_000).toISOString() : null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      media: { images, video: form.video || undefined },
      specifications: specs,
      is_active: form.is_active,
    };
    if (form.id) {
      const { data, error } = await supabase.from('products').update(payload).eq('id', form.id).select('*').maybeSingle();
      if (error) { toast.error(error.message); setSaving(false); return; }
      if (data) setProducts((p) => p.map((x) => (x.id === form.id ? (data as Product) : x)));
      toast.success('Product updated');
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select('*').maybeSingle();
      if (error) { toast.error(error.message); setSaving(false); return; }
      if (data) setProducts((p) => [data as Product, ...p]);
      toast.success('Product created');
    }
    setSaving(false);
    setOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('products').delete().eq('id', deleteId);
    if (error) { toast.error('Failed to delete'); return; }
    setProducts((p) => p.filter((x) => x.id !== deleteId));
    toast.success('Product deleted');
    setDeleteId(null);
  };

  const exportCSV = () => {
    const headers = ['name', 'slug', 'sku', 'price', 'stock', 'category', 'brand', 'is_active'];
    const rows = products.map((p) => [p.name, p.slug, p.sku, p.price, p.stock, p.category?.name, p.brand?.name, p.is_active]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cedar-products.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> Export</Button>
          <Button size="sm" onClick={openNew} className="gradient-cedar text-white"><Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> Add Product</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="ltr:pl-9 rtl:pr-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">Product</th>
                  <th className="px-4 py-3 text-start font-medium">SKU</th>
                  <th className="px-4 py-3 text-start font-medium">Price</th>
                  <th className="px-4 py-3 text-start font-medium">Stock</th>
                  <th className="px-4 py-3 text-start font-medium">Status</th>
                  <th className="px-4 py-3 text-end font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.media?.images?.[0] && <img src={p.media.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover" />}
                        <span className="font-medium line-clamp-1 max-w-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.sku || '—'}</td>
                    <td className="px-4 py-3 font-bold text-primary">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3"><Badge variant={p.stock < 10 ? 'destructive' : 'secondary'}>{p.stock}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={p.is_active ? 'default' : 'outline'}>{p.is_active ? 'Active' : 'Hidden'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => duplicate(p)}><Copy className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* product form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
              <div><Label>Barcode</Label><Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} /></div>
              <div><Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Brand</Label>
                <Select value={form.brand_id} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Price *</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div><Label>Compare-at price</Label><Input type="number" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} /></div>
              <div><Label>Discount %</Label><Input type="number" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Badge (e.g. "Best Seller")</Label><Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></div>
            <div><Label>Images (one URL per line)</Label><Textarea rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Video URL</Label><Input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} /></div>
            <div><Label>Specifications (JSON)</Label><Textarea rows={4} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} className="font-mono text-xs" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Meta title</Label><Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} /></div>
              <div><Label>Meta description</Label><Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {([['is_featured', 'Featured'], ['is_trending', 'Trending'], ['is_bestseller', 'Best Seller'], ['is_new', 'New'], ['is_flash_sale', 'Flash Sale'], ['is_active', 'Active']] as const).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Switch checked={form[key]} onCheckedChange={(v) => setForm({ ...form, [key]: v })} />
                  <Label>{label}</Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="gradient-cedar text-white">{saving ? 'Saving…' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
