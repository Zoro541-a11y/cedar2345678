import type { ReactNode } from 'react';
import type { Metadata } from 'next';

interface StaticLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function StaticLayout({ title, description, children }: StaticLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="glass-card overflow-hidden">
        <div className="gradient-cedar p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-sm text-white/80">{description}</p>}
        </div>
        <div className="prose prose-sm max-w-none p-6 dark:prose-invert md:p-8">{children}</div>
      </div>
    </div>
  );
}

export function staticMetadata(title: string, description?: string): Metadata {
  return { title, description };
}
