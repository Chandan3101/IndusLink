/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export const EyesPointer: React.FC = () => {
  const pillRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Accessibility & device verification checks
    const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!hoverFine.matches || reducedMotion.matches) {
      return;
    }

    const pill = pillRef.current;
    const leftPupil = leftPupilRef.current;
    const rightPupil = rightPupilRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;

    if (!pill || !leftPupil || !rightPupil || !leftEye || !rightEye) return;

    // Dimensions derived from pill height
    const pillHeight = 25;
    const eyeDiameter = 0.36 * pillHeight; // 9px
    const pupilDiameter = 0.5 * eyeDiameter; // 4.5px
    const maxPupilTravel = 0.75 * ((eyeDiameter - pupilDiameter) / 2); // ~1.69px
    const gazeGain = 26;
    const followTrailFactor = 0.08;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringInteractive = false;
    let isVisible = false;

    let animFrameId: number;
    let blinkTimeoutId: NodeJS.Timeout;

    // Pointer move listener
    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = targetX;
        currentY = targetY;
        pill.style.opacity = '1';
      }

      // Check for interactive targets (a, button, input)
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && typeof targetEl.closest === 'function') {
        isHoveringInteractive = !!targetEl.closest('a, button, input, select, textarea');
      } else {
        isHoveringInteractive = false;
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      pill.style.opacity = '0';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    // Blinking mechanism (~3s interval, 170ms duration, 0.3 randomness)
    const scheduleNextBlink = () => {
      const baseInterval = 3000;
      const randomness = 0.3;
      const nextDelay = baseInterval * (1 + (Math.random() - 0.5) * 2 * randomness);

      blinkTimeoutId = setTimeout(() => {
        // Close eyelids
        leftEye.style.transform = 'scaleY(0.1)';
        rightEye.style.transform = 'scaleY(0.1)';

        setTimeout(() => {
          // Open eyelids
          leftEye.style.transform = 'scaleY(1)';
          rightEye.style.transform = 'scaleY(1)';
          scheduleNextBlink();
        }, 170);
      }, nextDelay);
    };

    scheduleNextBlink();

    // Single requestAnimationFrame loop
    const tick = () => {
      if (isVisible) {
        // Smooth follow trail
        currentX += (targetX - currentX) * followTrailFactor;
        currentY += (targetY - currentY) * followTrailFactor;

        // Position pill offset from cursor so it doesn't obstruct native cursor
        const offsetX = currentX + 16;
        const offsetY = currentY + 16;

        pill.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${
          isHoveringInteractive ? 1.08 : 1
        })`;

        if (isHoveringInteractive) {
          pill.style.borderColor = 'rgba(16, 185, 129, 0.7)';
          pill.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.35)';
        } else {
          pill.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          pill.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.6)';
        }

        // Calculate pupil gaze toward pointer coordinates
        const dx = targetX - (offsetX + 15);
        const dy = targetY - (offsetY + 12);
        const dist = Math.hypot(dx, dy);

        if (dist > 0.1) {
          const clampedTravel = Math.min(maxPupilTravel, (dist / gazeGain) * maxPupilTravel);
          const px = (dx / dist) * clampedTravel;
          const py = (dy / dist) * clampedTravel;

          leftPupil.style.transform = `translate(${px}px, ${py}px)`;
          rightPupil.style.transform = `translate(${px}px, ${py}px)`;
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    // Teardown and cleanup
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(animFrameId);
      clearTimeout(blinkTimeoutId);
    };
  }, []);

  return (
    <div
      ref={pillRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '82px',
        height: '25px',
        borderRadius: '36px',
        backgroundColor: '#000000',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px 0 10px',
        boxSizing: 'border-box',
        transition: 'opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        willChange: 'transform',
      }}
    >
      {/* Label Text */}
      <span
        style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 500,
          fontSize: '11px',
          color: '#FFFFFF',
          letterSpacing: '0.02em',
          userSelect: 'none',
        }}
      >
        Explore
      </span>

      {/* Eyes Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1px',
        }}
      >
        {/* Left Eye */}
        <div
          ref={leftEyeRef}
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'transform 0.1s ease',
          }}
        >
          <div
            ref={leftPupilRef}
            style={{
              width: '4.5px',
              height: '4.5px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Right Eye */}
        <div
          ref={rightEyeRef}
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'transform 0.1s ease',
          }}
        >
          <div
            ref={rightPupilRef}
            style={{
              width: '4.5px',
              height: '4.5px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </div>
  );
};
