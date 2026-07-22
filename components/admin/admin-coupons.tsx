'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { formatPrice } from '@/lib/format';
import type { Coupon } from '@/lib/types';
import { toast } from 'sonner';

interface FormState {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: string;
  min_order: string;
  max_uses: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

const empty: FormState = { code: '', type: 'percentage', value: '0', min_order: '0', max_uses: '', valid_from: '', valid_until: '', is_active: true };

export function AdminCoupons({ initial }: { initial: Coupon[] }) {
  const supabase = getSupabaseBrowser();
  const [items, setItems] = useState<Coupon[]>(initial);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState>(empty);
  const [open, setOpen] = useState(false);

  const filtered = items.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (c: Coupon) => {
    setForm({
      id: c.id,
      code: c.code,
      type: c.type,
      value: String(c.value),
      min_order: String(c.min_order),
      max_uses: c.max_uses ? String(c.max_uses) : '',
      valid_from: c.valid_from ? c.valid_from.slice(0, 10) : '',
      valid_until: c.valid_until ? c.valid_until.slice(0, 10) : '',
      is_active: c.is_active,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      min_order: Number(form.min_order),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      valid_from: form.valid_from ? new Date(form.valid_from).toISOString() : null,
      valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
      is_active: form.is_active,
    };
    if (form.id) {
      const { data, error } = await supabase.from('coupons').update(payload).eq('id', form.id).select('*').maybeSingle();
      if (error) { toast.error(error.message); return; }
      if (data) setItems((p) => p.map((x) => (x.id === form.id ? (data as Coupon) : x)));
      toast.success('Coupon updated');
    } else {
      const { data, error } = await supabase.from('coupons').insert(payload).select('*').maybeSingle();
      if (error) { toast.error(error.message); return; }
      if (data) setItems((p) => [...p, data as Coupon]);
      toast.success('Coupon created');
    }
    setOpen(false);
  };

  const del = async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) { toast.error('Failed'); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Coupons</h1><p className="text-sm text-muted-foreground">{items.length} coupons</p></div>
        <Button size="sm" onClick={openNew} className="gradient-cedar text-white"><Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> Add</Button>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="ltr:pl-9 rtl:pr-9" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">Code</th>
                  <th className="px-4 py-3 text-start font-medium">Type</th>
                  <th className="px-4 py-3 text-start font-medium">Value</th>
                  <th className="px-4 py-3 text-start font-medium">Min Order</th>
                  <th className="px-4 py-3 text-start font-medium">Used</th>
                  <th className="px-4 py-3 text-start font-medium">Status</th>
                  <th className="px-4 py-3 text-end font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{c.type}</Badge></td>
                    <td className="px-4 py-3 font-medium">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                    <td className="px-4 py-3">{formatPrice(c.min_order)}</td>
                    <td className="px-4 py-3">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                    <td className="px-4 py-3"><Badge variant={c.is_active ? 'default' : 'outline'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? 'Edit' : 'Add'} Coupon</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required className="font-mono" /></div>
            <div>
              <Label>Discount Type</Label>
              <Select value={form.type} onValueChange={(v: 'percentage' | 'fixed') => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Value *</Label><Input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required /></div>
            <div><Label>Minimum Order</Label><Input type="number" step="0.01" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} /></div>
            <div><Label>Max Uses (blank = unlimited)</Label><Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Valid From</Label><Input type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} /></div>
              <div><Label>Valid Until</Label><Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
            <DialogFooter><Button type="submit" className="gradient-cedar text-white">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
