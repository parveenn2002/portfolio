import { useEffect, useRef } from 'react';
import { CanvasStage } from './engine/CanvasStage.ts';
import { parseColor } from './engine/math.ts';
import type { ScenePalette } from './engine/types.ts';
import { createPresetScene, type PresetName } from './presets.ts';

interface InteractiveBackgroundProps {
  preset: PresetName;
  className?: string;
}

/** Theme colours come from the active mode's CSS variables. */
function readPalette(el: Element): ScenePalette {
  const style = getComputedStyle(el);
  return {
    ink: parseColor(style.getPropertyValue('--mode-ink'), [230, 235, 240]),
    accent: parseColor(style.getPropertyValue('--mode-accent'), [108, 196, 212]),
  };
}

/**
 * Decorative, pointer-reactive canvas that fills its positioned parent.
 * React only mounts and unmounts it: all per-frame work happens in
 * CanvasStage, outside React state. Hidden from assistive technology and
 * ignores pointer events, so it never blocks content or navigation.
 *
 * Avoid CSS masks/filters on this element: they are re-composited every
 * frame. Fade edges with an overlay element instead.
 */
export function InteractiveBackground({ preset, className = '' }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stage = new CanvasStage(canvas, {
      scene: createPresetScene(preset),
      palette: () => readPalette(canvas),
      onFirstFrame: () => {
        canvas.style.opacity = '1';
      },
    });
    stage.start();

    if (import.meta.env.DEV) {
      // Exposed for manual inspection and automated checks in development only.
      (canvas as HTMLCanvasElement & { __stage?: CanvasStage }).__stage = stage;
    }
    return () => stage.destroy();
  }, [preset]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-[1400ms] ease-out-soft ${className}`}
    />
  );
}
