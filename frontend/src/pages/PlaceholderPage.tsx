import { motion } from 'framer-motion';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-12 text-center"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500">This page is under construction.</p>
    </motion.div>
  );
}

export default PlaceholderPage;
