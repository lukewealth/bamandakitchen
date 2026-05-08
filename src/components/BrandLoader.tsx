/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function BrandLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-surface/50 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-accent/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Inner Logo Placeholder / Brand Element */}
        <motion.div
          className="absolute inset-2 border-t-2 border-accent rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute inset-[45%] bg-accent rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
