/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RibbedStructureCanvasProps {
  className?: string;
}

interface StageKeyframe {
  groupPos: THREE.Vector3;
  groupRot: THREE.Euler;
  cameraPos: THREE.Vector3;
  emeraldIntensity: number;
  cyanIntensity: number;
  goldIntensity: number;
}

export const RibbedStructureCanvas: React.FC<RibbedStructureCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!isWebGLAvailable()) {
      return;
    }

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // Group holding the ribbed structure
    const structureGroup = new THREE.Group();
    scene.add(structureGroup);

    // Number of fins (adaptive for mobile performance)
    const isMobile = width < 768;
    const FIN_COUNT = isMobile ? 32 : 52;

    // Spline path along which the fins are arranged
    // Extended wide path spanning diagonal depth
    const splinePoints = [
      new THREE.Vector3(8.5, 5.5, -4.5),
      new THREE.Vector3(5.5, 3.8, -2.2),
      new THREE.Vector3(2.5, 1.8, 0.5),
      new THREE.Vector3(0.0, -0.2, 2.2),
      new THREE.Vector3(-2.8, -1.8, 1.6),
      new THREE.Vector3(-5.8, -3.4, -0.8),
      new THREE.Vector3(-9.2, -5.2, -3.8),
    ];
    const curve = new THREE.CatmullRomCurve3(splinePoints);

    // Create rounded aerodynamic blade/fin geometry with pristine bevels
    const createFinGeometry = () => {
      const shape = new THREE.Shape();
      const h = 4.8;
      const w = 1.05;
      const r = 0.44;

      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.15,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.055,
        bevelThickness: 0.055,
      };

      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.center();
      return geom;
    };

    const finGeometry = createFinGeometry();

    // Wallstreet Emerald Glossy MeshPhysicalMaterial
    const finMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111822,
      metalness: 0.2,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.42,
      ior: 1.54,
      thickness: 1.3,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.88,
    });

    const instancedMesh = new THREE.InstancedMesh(finGeometry, finMaterial, FIN_COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Wallstreet Color Palette:
    // Electric Emerald -> Mint/Cyan -> Lavender/Steel -> Champagne Metallic
    const colorEmerald = new THREE.Color(0x10b981); // Emerald #10B981
    const colorCyan = new THREE.Color(0x06b6d4);    // Cyan #06B6D4
    const colorMint = new THREE.Color(0x34d399);    // Mint #34D399
    const colorGold = new THREE.Color(0xc9aa79);    // Champagne #C9AA79
    const colorObsidian = new THREE.Color(0x0d121c); // Deep Obsidian

    for (let i = 0; i < FIN_COUNT; i++) {
      const t = i / (FIN_COUNT - 1);
      const finColor = new THREE.Color();

      if (t < 0.35) {
        finColor.lerpColors(colorEmerald, colorMint, t / 0.35);
      } else if (t < 0.7) {
        finColor.lerpColors(colorMint, colorCyan, (t - 0.35) / 0.35);
      } else {
        finColor.lerpColors(colorCyan, colorGold, (t - 0.7) / 0.3);
      }

      // Blend with deep obsidian glass core for rich dark luxury tone
      finColor.lerp(colorObsidian, 0.32);
      instancedMesh.setColorAt(i, finColor);
    }

    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }

    structureGroup.add(instancedMesh);

    // Lighting Setup — Wallstreet Studio Lighting with Emerald Key
    const ambientLight = new THREE.AmbientLight(0x090d14, 1.5);
    scene.add(ambientLight);

    // Key directional light for crisp bevel highlights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    // Primary Emerald Light (Signature Wallstreet Green)
    const emeraldLight = new THREE.PointLight(0x10b981, 4.4, 35);
    emeraldLight.position.set(4.0, 3.0, 4.0);
    scene.add(emeraldLight);

    // Cool Cyan Secondary Fill
    const cyanLight = new THREE.PointLight(0x06b6d4, 3.4, 30);
    cyanLight.position.set(-3.5, 0.5, 3.8);
    scene.add(cyanLight);

    // Champagne Gold Accent
    const goldLight = new THREE.PointLight(0xc9aa79, 2.6, 26);
    goldLight.position.set(1.5, -4.0, 3.5);
    scene.add(goldLight);

    // Deep Emerald Rim Light
    const rimEmeraldLight = new THREE.PointLight(0x059669, 3.0, 28);
    rimEmeraldLight.position.set(-5.0, 2.5, -2.5);
    scene.add(rimEmeraldLight);

    // 4 Continuous Scroll Stages Keyframes
    const STAGES: StageKeyframe[] = [
      // Stage 1: Hero / Opening
      {
        groupPos: new THREE.Vector3(1.8, -0.15, 0.0),
        groupRot: new THREE.Euler(-0.25, 0.45, -0.32),
        cameraPos: new THREE.Vector3(0, 0, 11),
        emeraldIntensity: 4.4,
        cyanIntensity: 3.4,
        goldIntensity: 2.4,
      },
      // Stage 2: Evaluation Section
      {
        groupPos: new THREE.Vector3(-1.4, -0.8, -1.2),
        groupRot: new THREE.Euler(0.18, -0.38, 0.22),
        cameraPos: new THREE.Vector3(-0.4, -0.3, 10.2),
        emeraldIntensity: 5.2,
        cyanIntensity: 3.8,
        goldIntensity: 2.8,
      },
      // Stage 3: Opportunities Section
      {
        groupPos: new THREE.Vector3(1.9, 0.35, -2.2),
        groupRot: new THREE.Euler(-0.35, 0.75, -0.18),
        cameraPos: new THREE.Vector3(0.5, -0.2, 10.8),
        emeraldIntensity: 4.8,
        cyanIntensity: 4.2,
        goldIntensity: 3.6,
      },
      // Stage 4: Explore Section & Final Conversion
      {
        groupPos: new THREE.Vector3(0.0, -0.9, -3.0),
        groupRot: new THREE.Euler(0.25, 0.15, 0.40),
        cameraPos: new THREE.Vector3(0, -0.5, 11.5),
        emeraldIntensity: 4.6,
        cyanIntensity: 3.2,
        goldIntensity: 4.2,
      },
    ];

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouseX = (e.clientX - halfW) / halfW;
      targetMouseY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Global scroll progress tracking
    let currentScrollProgress = 0;
    let targetScrollProgress = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      targetScrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();

    const currentPos = new THREE.Vector3();
    const currentRot = new THREE.Euler();
    const currentCamPos = new THREE.Vector3();

    const render = () => {
      const time = clock.getElapsedTime();

      // Smooth lerp mouse and continuous scroll progress
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

      // Calculate interpolation segment across 4 stages
      // 0.0 -> Stage 0; 0.333 -> Stage 1; 0.666 -> Stage 2; 1.0 -> Stage 3
      let fromIdx = 0;
      let toIdx = 1;
      let segT = 0;

      if (currentScrollProgress < 0.333) {
        fromIdx = 0;
        toIdx = 1;
        segT = currentScrollProgress / 0.333;
      } else if (currentScrollProgress < 0.666) {
        fromIdx = 1;
        toIdx = 2;
        segT = (currentScrollProgress - 0.333) / 0.333;
      } else {
        fromIdx = 2;
        toIdx = 3;
        segT = (currentScrollProgress - 0.666) / 0.334;
      }

      // Smoothstep easing for graceful cinematic stage transitions
      const smoothT = segT * segT * (3 - 2 * segT);

      const kFrom = STAGES[fromIdx];
      const kTo = STAGES[toIdx];

      // Interpolate Group Position
      currentPos.lerpVectors(kFrom.groupPos, kTo.groupPos, smoothT);

      // Interpolate Group Rotation
      currentRot.x = THREE.MathUtils.lerp(kFrom.groupRot.x, kTo.groupRot.x, smoothT);
      currentRot.y = THREE.MathUtils.lerp(kFrom.groupRot.y, kTo.groupRot.y, smoothT);
      currentRot.z = THREE.MathUtils.lerp(kFrom.groupRot.z, kTo.groupRot.z, smoothT);

      // Interpolate Camera Position
      currentCamPos.lerpVectors(kFrom.cameraPos, kTo.cameraPos, smoothT);

      // Idle wave & subtle floating drift
      const speed = prefersReducedMotion ? 0.03 : 0.42;
      const idleWave = Math.sin(time * speed) * 0.07;
      const idleTilt = Math.cos(time * speed * 0.8) * 0.05;

      structureGroup.position.copy(currentPos);
      structureGroup.position.x += mouseX * 0.35;
      structureGroup.position.y += -mouseY * 0.25 + idleWave;

      structureGroup.rotation.x = currentRot.x - mouseY * 0.12 + idleTilt;
      structureGroup.rotation.y = currentRot.y + mouseX * 0.18 + idleWave * 0.4;
      structureGroup.rotation.z = currentRot.z;

      camera.position.copy(currentCamPos);

      // Interpolate dynamic light intensities
      emeraldLight.intensity = THREE.MathUtils.lerp(kFrom.emeraldIntensity, kTo.emeraldIntensity, smoothT) + Math.sin(time * 1.5) * 0.35;
      cyanLight.intensity = THREE.MathUtils.lerp(kFrom.cyanIntensity, kTo.cyanIntensity, smoothT) + Math.cos(time * 1.2) * 0.3;
      goldLight.intensity = THREE.MathUtils.lerp(kFrom.goldIntensity, kTo.goldIntensity, smoothT) + Math.sin(time * 1.7) * 0.25;

      // Update individual fin matrices along the curve
      for (let i = 0; i < FIN_COUNT; i++) {
        const t = i / (FIN_COUNT - 1);

        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();

        const finWave = prefersReducedMotion ? 0 : Math.sin(time * 1.1 + i * 0.15) * 0.13;
        const finTwist = prefersReducedMotion ? 0 : Math.cos(time * 0.85 + i * 0.11) * 0.08;

        dummy.position.copy(point);
        dummy.position.y += finWave;
        dummy.position.z += finWave * 0.45;

        dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        dummy.rotateZ(t * 1.85 + finTwist);
        dummy.rotateX(0.24 + finWave * 0.25);

        const centerScale = 1.0 + Math.sin(t * Math.PI) * 0.24;
        dummy.scale.set(centerScale, centerScale, centerScale);

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      finGeometry.dispose();
      finMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    />
  );
};
