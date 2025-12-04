import type { CountSystem, FiberType, SpinType, ProcessType } from '../types/yarn.types';

// ============================================================================
// Count Systems
// ============================================================================

export const COUNT_SYSTEMS: { value: CountSystem; label: string }[] = [
  { value: 'Ne', label: 'Ne (English)' },
  { value: 'Nm', label: 'Nm (Metric)' },
  { value: 'Denier', label: 'Denier' },
  { value: 'tex', label: 'tex' },
  { value: 'dtex', label: 'dtex' },
];

// ============================================================================
// Fiber Types
// ============================================================================

export const NATURAL_FIBERS: { value: FiberType; label: string }[] = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'wool', label: 'Wool' },
  { value: 'linen', label: 'Linen' },
  { value: 'silk', label: 'Silk' },
];

export const SYNTHETIC_FIBERS: { value: FiberType; label: string }[] = [
  { value: 'acrylic', label: 'Acrylic' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'elastane', label: 'Elastane' },
  { value: 'spandex', label: 'Spandex' },
  { value: 'nylon', label: 'Nylon' },
];

export const ALL_FIBERS = [...NATURAL_FIBERS, ...SYNTHETIC_FIBERS];

// ============================================================================
// Spin Types
// ============================================================================

export const SPIN_TYPES: { value: SpinType; label: string }[] = [
  { value: 'ring_spun', label: 'Ring Spun' },
  { value: 'core_spun', label: 'Core Spun' },
  { value: 'air_jet', label: 'Air Jet' },
  { value: 'slub', label: 'Slub' },
  { value: 'siro', label: 'Siro' },
];

// ============================================================================
// Process Types
// ============================================================================

export const PROCESS_TYPES: { value: ProcessType; label: string; description: string }[] = [
  {
    value: 'ply',
    label: 'Ply',
    description: 'Twist two or more yarns together to create a thicker yarn',
  },
  {
    value: 'cable',
    label: 'Cable',
    description: 'Like plying, but with alternating twist directions',
  },
  {
    value: 'cover',
    label: 'Cover',
    description: 'Wrap a yarn around another yarn to physically cover the interior',
  },
  {
    value: 'dye',
    label: 'Dye',
    description: 'Dye the yarn to a new color',
  },
  {
    value: 'bleach',
    label: 'Bleach',
    description: 'Remove natural color from the yarn',
  },
  {
    value: 'mercerize',
    label: 'Mercerize',
    description: 'Treat with caustic soda to improve luster, strength, and dye affinity',
  },
];

export const SIMPLE_PROCESSES = PROCESS_TYPES.filter((p) =>
  ['dye', 'bleach', 'mercerize'].includes(p.value)
);

export const COMPOSITE_PROCESSES = PROCESS_TYPES.filter((p) =>
  ['ply', 'cable', 'cover'].includes(p.value)
);
