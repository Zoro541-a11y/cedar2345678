'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAuth } from '@/lib/auth-context';

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  lowStock: number;
  recentOrders: any[];
  topProducts: any[];
  salesByDay: { date: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
}

export function useAdminStats(): { stats: AdminStats | null; loading: boolean } {
  const { user, isAdmin } = useAuth();
  const supabase = getSupabaseBrowser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    (async () => {
      const [
        { count: totalOrders },
        { count: pendingOrders },
        { data: orders },
        { count: totalProducts },
        { count: totalCustomers },
        { data: products },
        { data: recentOrders },
        { data: topProducts },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('total'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('stock').lt('stock', 10),
        supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').order('created_at', { ascending: false }).limit(8),
        supabase.from('products').select('id, name, sold_count, price, slug').order('sold_count', { ascending: false }).limit(5),
      ]);

      const totalRevenue = (orders ?? []).reduce((s, o) => s + Number(o.total), 0);
      const lowStock = (products ?? []).filter((p) => p.stock < 10).length;

      // sales by day (last 7)
      const days: { date: string; revenue: number; orders: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dayOrders = (recentOrders ?? []).filter((o) => o.created_at?.slice(0, 10) === dateStr);
        days.push({ date: dateStr, revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0), orders: dayOrders.length });
      }

      // orders by status
      const statusCounts: Record<string, number> = {};
      (recentOrders ?? []).forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
      });

      setStats({
        totalOrders: totalOrders ?? 0,
        pendingOrders: pendingOrders ?? 0,
        totalRevenue,
        totalProducts: totalProducts ?? 0,
        totalCustomers: totalCustomers ?? 0,
        lowStock,
        recentOrders: recentOrders ?? [],
        topProducts: topProducts ?? [],
        salesByDay: days,
        ordersByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      });
      setLoading(false);
    })();
  }, [user, isAdmin, supabase]);

  return { stats, loading };
}
