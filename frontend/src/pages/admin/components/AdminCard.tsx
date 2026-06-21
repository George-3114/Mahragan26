import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AdminCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AdminCard({ title, children, className = '', delay = 0 }: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}
    >
      {title && <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>}
      {children}
    </motion.div>
  );
}
