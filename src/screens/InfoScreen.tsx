/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Screen } from '../types';

interface InfoScreenProps {
  title: string;
  subtitle: string;
  content: string;
  onBack: () => void;
}

export default function InfoScreen({ title, subtitle, content, onBack }: InfoScreenProps) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-20 bg-surface">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-on-surface-variant hover:text-accent transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          <span className="editorial-label text-[10px] uppercase tracking-widest">Return to Sanctuary</span>
        </button>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="editorial-label text-accent mb-4 tracking-[0.4em] uppercase">{subtitle}</div>
          <h1 className="font-serif italic text-6xl md:text-8xl text-on-surface">{title}</h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="font-sans text-on-surface-variant text-lg leading-relaxed space-y-8 whitespace-pre-line">
            {content}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
