import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Custom404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            404
          </h1>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mt-4 mb-8">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Custom404;
