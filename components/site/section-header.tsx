'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  href?: string;
  viewAllLabel?: string;
  accent?: 'cedar' | 'gold';
}

export function SectionHeader({ title, href, viewAllLabel = 'View all', accent = 'cedar' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <span className={`h-7 w-1.5 rounded-full ${accent === 'gold' ? 'gradient-gold' : 'gradient-cedar'}`} />
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {viewAllLabel}
          <ChevronRight className="h-4 w-4 ltr:rotate-0 rtl:rotate-180" />
        </Link>
      )}
    </motion.div>
  );
}
