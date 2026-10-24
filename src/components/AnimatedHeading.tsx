/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import TextEngine from 'spring-text-engine';

export interface AnimatedHeadingProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  tag = 'h2',
  children,
  className = '',
  id,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const Component = tag;
  const textContent = typeof children === 'string' ? children : undefined;

  // Static fallback when reduced-motion is requested or SSR
  if (!mounted || prefersReducedMotion) {
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <TextEngine
      id={id}
      tag={tag}
      mode="once"
      letterOut={{ opacity: 0, skewX: 16, y: 14 }}
      letterIn={{ opacity: 1, skewX: 0, y: 0 }}
      letterConfig={{ tension: 240, friction: 20 }}
      letterStagger={30}
      className={className}
      seo={true}
      aria-label={textContent}
    >
      {children}
    </TextEngine>
  );
};
