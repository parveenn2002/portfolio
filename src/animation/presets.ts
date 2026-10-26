import type { Scene } from './engine/types.ts';
import { NetworkScene, type NetworkOptions } from './scenes/networkScene.ts';

/**
 * Tunable parameters for each mode's background. Adjust values here rather
 * than in the engine.
 */
export const careerNetwork: NetworkOptions = {
  density: 15000,
  minNodes: 24,
  maxNodes: 110,
  maxNodesCompact: 42,
  linkDistance: 150,
  maxLinksPerNode: 5,
  pointerRadius: 190,
  pointerStrength: 0.55, // repel: clears a little space around the cursor
  spring: 0.018,
  damping: 0.82, // ≈2% overshoot, ~0.4 s to settle — eased, not springy
  drift: 9,
  driftSpeed: 0.32,
  parallax: 14,
  lineAlpha: 0.2,
  nodeAlpha: 0.75,
  accentShare: 0.12,
  atomShare: 0.1,
  seed: 7,
};

export type PresetName = 'career-network';

export const createPresetScene = (name: PresetName): Scene => {
  switch (name) {
    case 'career-network':
      return new NetworkScene(careerNetwork);
  }
};
