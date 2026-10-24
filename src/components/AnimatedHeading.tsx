/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import TextEngine from 'spring-text-engine';

export type HeadingEffect = 'skew' | 'unblurLines' | 'softFocus' | 'fadeLetters';

export interface AnimatedHeadingProps {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  effect?: HeadingEffect;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  tag = 'h2',
  effect,
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

  // Determine effect based on prop or sensible tag default
  const resolvedEffect: HeadingEffect =
    effect ||
    (tag === 'h1'
      ? 'skew'
      : tag === 'h2'
      ? 'unblurLines'
      : tag === 'h3'
      ? 'softFocus'
      : 'fadeLetters');

  // A. Hero headline — Skew In
  if (resolvedEffect === 'skew') {
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
  }

  // B. Major section headings — Unblur Lines
  if (resolvedEffect === 'unblurLines') {
    return (
      <TextEngine
        id={id}
        tag={tag}
        mode="once"
        lineOut={{ opacity: 0, filter: 'blur(10px)' }}
        lineIn={{ opacity: 1, filter: 'blur(0px)' }}
        lineConfig={{ tension: 190, friction: 26 }}
        lineStagger={90}
        className={className}
        seo={true}
        aria-label={textContent}
      >
        {children}
      </TextEngine>
    );
  }

  // C. Selected dashboard and module headings — Soft Focus
  if (resolvedEffect === 'softFocus') {
    return (
      <TextEngine
        id={id}
        tag={tag}
        mode="once"
        wordOut={{ opacity: 0, filter: 'blur(10px)' }}
        wordIn={{ opacity: 1, filter: 'blur(0px)' }}
        wordConfig={{ tension: 180, friction: 24 }}
        wordStagger={60}
        className={className}
        seo={true}
        aria-label={textContent}
      >
        {children}
      </TextEngine>
    );
  }

  // D. Small card and dialog headings — Fade Letters
  return (
    <TextEngine
      id={id}
      tag={tag}
      mode="once"
      letterOut={{ opacity: 0 }}
      letterIn={{ opacity: 1 }}
      letterConfig={{ tension: 150, friction: 24 }}
      letterStagger={34}
      className={className}
      seo={true}
      aria-label={textContent}
    >
      {children}
    </TextEngine>
  );
};
