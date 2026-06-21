import type { ReactNode } from 'react';

interface AdminListRowProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function AdminListRow({ children, actions }: AdminListRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">{children}</div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function AdminEmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-gray-500">{message}</div>
  );
}

export function AdminBadge({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const colors = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

export function AdminMessage({
  type,
  children,
}: {
  type: 'success' | 'error';
  children: ReactNode;
}) {
  const colors = type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';
  return <div className={`p-3 rounded-xl text-sm ${colors}`}>{children}</div>;
}
