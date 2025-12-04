import type { Yarn, BasicYarn, ProcessedYarn } from '../types';

// ============================================================================
// Basic Yarns
// ============================================================================

export const cottonYarn: BasicYarn = {
  type: 'basic',
  id: 'yarn-1',
  name: '30/1 Cotton',
  fiberComposition: [{ fiber: 'cotton', percentage: 100 }],
  count: { value: 30, system: 'Ne' },
  spinType: 'ring_spun',
};

export const polyesterYarn: BasicYarn = {
  type: 'basic',
  id: 'yarn-2',
  name: '50D Polyester',
  fiberComposition: [{ fiber: 'polyester', percentage: 100 }],
  count: { value: 50, system: 'Denier' },
  spinType: 'air_jet',
};

export const woolYarn: BasicYarn = {
  type: 'basic',
  id: 'yarn-3',
  name: 'Merino Wool',
  fiberComposition: [{ fiber: 'wool', percentage: 100 }],
  count: { value: 28, system: 'Ne' },
  spinType: 'ring_spun',
};

export const elastaneYarn: BasicYarn = {
  type: 'basic',
  id: 'yarn-4',
  name: '40D Elastane',
  fiberComposition: [{ fiber: 'elastane', percentage: 100 }],
  count: { value: 40, system: 'Denier' },
  spinType: 'core_spun',
};

// ============================================================================
// Simple Processed Yarns
// ============================================================================

// Dyed cotton
export const dyedCotton: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-5',
  name: 'Navy Blue Cotton',
  baseYarn: cottonYarn,
  process: {
    type: 'dye',
    color: '#000080',
  },
};

// Bleached wool
export const bleachedWool: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-6',
  name: 'Bleached Wool',
  baseYarn: woolYarn,
  process: {
    type: 'bleach',
  },
};

// Mercerized cotton
export const mercerizedCotton: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-7',
  name: 'Mercerized Cotton',
  baseYarn: cottonYarn,
  process: {
    type: 'mercerize',
  },
};

// ============================================================================
// Composite Yarns
// ============================================================================

// 2-ply cotton/polyester blend
export const cottonPolyPly: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-8',
  name: 'Cotton/Poly 2-Ply',
  baseYarn: cottonYarn, // Not used for ply, but required by type
  process: {
    type: 'ply',
    yarns: [cottonYarn, polyesterYarn],
  },
};

// 3-cable with elastane for stretch
export const stretchCable: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-9',
  name: 'Stretch Cable Yarn',
  baseYarn: cottonYarn,
  process: {
    type: 'cable',
    yarns: [cottonYarn, polyesterYarn, elastaneYarn],
  },
};

// Covered yarn (elastane core with cotton covering)
export const coveredStretch: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-10',
  name: 'Cotton Covered Elastane',
  baseYarn: elastaneYarn,
  process: {
    type: 'cover',
    coreYarn: elastaneYarn,
    coveringYarn: cottonYarn,
  },
};

// ============================================================================
// Complex Multi-Process Yarns
// ============================================================================

// Dyed and then plied
const dyedPolyester: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-11',
  name: 'Red Polyester',
  baseYarn: polyesterYarn,
  process: {
    type: 'dye',
    color: '#DC143C',
  },
};

export const dyedPly: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-12',
  name: 'Red/Navy 2-Ply',
  baseYarn: dyedCotton,
  process: {
    type: 'ply',
    yarns: [dyedCotton, dyedPolyester],
  },
};

// Mercerized, then dyed
export const mercerizedDyedCotton: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-13',
  name: 'Mercerized Emerald Cotton',
  baseYarn: mercerizedCotton,
  process: {
    type: 'dye',
    color: '#50C878',
  },
};

// Complex: Ply of dyed yarns, then covered with another yarn
export const complexYarn: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-14',
  name: 'Premium Sport Yarn',
  baseYarn: dyedPly,
  process: {
    type: 'cover',
    coreYarn: dyedPly,
    coveringYarn: mercerizedDyedCotton,
  },
};

// ============================================================================
// Export all yarns for easy access
// ============================================================================

export const allMockYarns: Yarn[] = [
  cottonYarn,
  polyesterYarn,
  woolYarn,
  elastaneYarn,
  dyedCotton,
  bleachedWool,
  mercerizedCotton,
  cottonPolyPly,
  stretchCable,
  coveredStretch,
  dyedPly,
  mercerizedDyedCotton,
  complexYarn,
];

// Export examples by category
export const basicYarns = [cottonYarn, polyesterYarn, woolYarn, elastaneYarn];
export const simpleProcessedYarns = [dyedCotton, bleachedWool, mercerizedCotton];
export const compositeYarns = [cottonPolyPly, stretchCable, coveredStretch];
export const complexYarns = [dyedPly, mercerizedDyedCotton, complexYarn];
