'use client';

import { useState } from 'react';
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
import type { Brand } from '@/lib/types';
import { toast } from 'sonner';

interface FormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  country: string;
  is_active: boolean;
}

const empty: FormState = { name: '', slug: '', description: '', logo_url: '', country: '', is_active: true };

export function AdminBrands({ initial }: { initial: Brand[] }) {
  const supabase = getSupabaseBrowser();
  const [items, setItems] = useState<Brand[]>(initial);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState>(empty);
  const [open, setOpen] = useState(false);

  const filtered = items.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (b: Brand) => {
    setForm({ id: b.id, name: b.name, slug: b.slug, description: b.description ?? '', logo_url: b.logo_url ?? '', country: b.country ?? '', is_active: b.is_active });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description, logo_url: form.logo_url, country: form.country, is_active: form.is_active };
    if (form.id) {
      const { data, error } = await supabase.from('brands').update(payload).eq('id', form.id).select('*').maybeSingle();
      if (error) { toast.error(error.message); return; }
      if (data) setItems((p) => p.map((x) => (x.id === form.id ? (data as Brand) : x)));
      toast.success('Brand updated');
    } else {
      const { data, error } = await supabase.from('brands').insert(payload).select('*').maybeSingle();
      if (error) { toast.error(error.message); return; }
      if (data) setItems((p) => [...p, data as Brand]);
      toast.success('Brand created');
    }
    setOpen(false);
  };

  const del = async (id: string) => {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) { toast.error('Failed'); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Brands</h1><p className="text-sm text-muted-foreground">{items.length} brands</p></div>
        <Button size="sm" onClick={openNew} className="gradient-cedar text-white"><Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> Add</Button>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="ltr:pl-9 rtl:pr-9" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-lg font-bold text-primary">{b.name.charAt(0)}</div>}
                <div className="flex-1"><p className="font-medium">{b.name}</p><p className="text-xs text-muted-foreground">{b.country}</p></div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant={b.is_active ? 'default' : 'outline'}>{b.is_active ? 'Active' : 'Hidden'}</Badge>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? 'Edit' : 'Add'} Brand</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Logo URL</Label><Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} /></div>
            <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
            <DialogFooter><Button type="submit" className="gradient-cedar text-white">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
