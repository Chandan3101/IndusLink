/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { calculateScrollProgress } from '../utils/evaluationEngine.ts';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
          const currentRatio = calculateScrollProgress(scrollY, scrollHeight, clientHeight);
          setProgress(currentRatio);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-black/[0.04] dark:bg-white/[0.05]"
    >
      <div
        className="h-full bg-[#9D1738] dark:bg-[#BE185D] origin-left will-change-transform shadow-[0_0_10px_rgba(157,23,56,0.6)] dark:shadow-[0_0_12px_rgba(190,24,93,0.7)] transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
};
