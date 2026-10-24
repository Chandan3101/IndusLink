/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gsap from 'gsap';

/**
 * Checks whether user prefers reduced motion
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Smooth entrance animation for container cards
 */
export const animateCardsStagger = (
  containerSelector: string | HTMLElement,
  itemSelector: string,
  delay = 0.1
) => {
  if (isReducedMotion()) return null;

  return gsap.fromTo(
    typeof containerSelector === 'string'
      ? `${containerSelector} ${itemSelector}`
      : containerSelector.querySelectorAll(itemSelector),
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      delay,
    }
  );
};

/**
 * Animate numbers counting up
 */
export const animateValue = (
  target: HTMLElement,
  start: number,
  end: number,
  duration = 1,
  prefix = '',
  suffix = ''
) => {
  if (isReducedMotion()) {
    target.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
    return;
  }

  const obj = { val: start };
  gsap.to(obj, {
    val: end,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      target.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
    },
  });
};

/**
 * Subtle pulse/glow for active elements
 */
export const animatePulse = (element: HTMLElement | null) => {
  if (!element || isReducedMotion()) return null;

  return gsap.to(element, {
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

/**
 * Material flow beam animation for process diagrams
 */
export const animateFlowLine = (pathElement: SVGPathElement | null) => {
  if (!pathElement || isReducedMotion()) return null;

  const length = pathElement.getTotalLength();
  gsap.set(pathElement, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  return gsap.to(pathElement, {
    strokeDashoffset: 0,
    duration: 1.8,
    ease: 'power2.inOut',
    repeat: -1,
    repeatDelay: 0.6,
  });
};
