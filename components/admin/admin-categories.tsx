'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { slugify } from '@/lib/format';
import type { Category } from '@/lib/types';
import { toast } from 'sonner';

interface FormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: string;
}

const empty: FormState = { name: '', slug: '', description: '', image_url: '', is_active: true, sort_order: '0' };

export function AdminCategories({ initial }: { initial: Category[] }) {
  const supabase = getSupabaseBrowser();
  const [items, setItems] = useState<Category[]>(initial);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState>(empty);
  const [open, setOpen] = useState(false);

  const filtered = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (c: Category) => {
    setForm({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? '', image_url: c.image_url ?? '', is_active: c.is_active, sort_order: String(c.sort_order) });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description, image_url: form.image_url, is_active: form.is_active, sort_order: Number(form.sort_order) };
    if (form.id) {
      const { data, error } = await supabase.from('categories').update(payload).eq('id', form.id).select('*').maybeSingle();
      if (error) { toast.error(error.message); return; }
      if (data) setItems((p) => p.map((x) => (x.id === form.id ? (data as Category) : x)));
      toast.success('Category updated');
    } else {
      const { data, error } = await supabase.from('categories').insert(payload).select('*').maybeSingle();
      if (error) { toast.error(error.message); return; }
      if (data) setItems((p) => [...p, data as Category]);
      toast.success('Category created');
    }
    setOpen(false);
  };

  const del = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Categories</h1><p className="text-sm text-muted-foreground">{items.length} categories</p></div>
        <Button size="sm" onClick={openNew} className="gradient-cedar text-white"><Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> Add</Button>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="ltr:pl-9 rtl:pr-9" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center gap-3 p-4">
              {c.image_url && <img src={c.image_url} alt={c.name} className="h-12 w-12 rounded-lg object-cover" />}
              <div className="flex-1"><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.slug}</p></div>
              <Badge variant={c.is_active ? 'default' : 'outline'}>{c.is_active ? 'Active' : 'Hidden'}</Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
            <DialogFooter><Button type="submit" className="gradient-cedar text-white">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
