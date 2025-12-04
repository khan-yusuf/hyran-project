// ============================================================================
// Count Systems
// ============================================================================

export type CountSystem = 'Ne' | 'Nm' | 'Denier' | 'tex' | 'dtex';

export interface YarnCount {
  value: number;
  system: CountSystem;
}

// ============================================================================
// Fibers
// ============================================================================

export type NaturalFiber = 'cotton' | 'wool' | 'linen' | 'silk';
export type SyntheticFiber = 'acrylic' | 'polyester' | 'elastane' | 'spandex' | 'nylon';
export type FiberType = NaturalFiber | SyntheticFiber;

export interface FiberComposition {
  fiber: FiberType;
  percentage: number; // 0-100
}

// ============================================================================
// Spin Types
// ============================================================================

export type SpinType = 'ring_spun' | 'core_spun' | 'air_jet' | 'slub' | 'siro';

// ============================================================================
// Process Types
// ============================================================================

export type ProcessType = 'dye' | 'bleach' | 'mercerize' | 'ply' | 'cable' | 'cover';

export interface DyeProcess {
  type: 'dye';
  color: string;
}

export interface BleachProcess {
  type: 'bleach';
}

export interface MercerizeProcess {
  type: 'mercerize';
}

export interface PlyProcess {
  type: 'ply';
  yarns: Yarn[]; // Array of yarns to ply together
}

export interface CableProcess {
  type: 'cable';
  yarns: Yarn[]; // Array of yarns to cable together
}

export interface CoverProcess {
  type: 'cover';
  coreYarn: Yarn;
  coveringYarn: Yarn;
}

export type YarnProcess =
  | DyeProcess
  | BleachProcess
  | MercerizeProcess
  | PlyProcess
  | CableProcess
  | CoverProcess;

// ============================================================================
// Yarn Types
// ============================================================================

export interface BasicYarn {
  type: 'basic';
  id: string;
  name?: string;
  fiberComposition: FiberComposition[]; // Must sum to 100%
  count: YarnCount;
  spinType: SpinType;
}

export interface ProcessedYarn {
  type: 'processed';
  id: string;
  name?: string;
  baseYarn: Yarn;
  process: YarnProcess;
}

// Union type for all yarn types
export type Yarn = BasicYarn | ProcessedYarn;

// ============================================================================
// Computed Properties (for display/calculations)
// ============================================================================

export interface ComputedYarnProperties {
  texWeight: number; // Final weight in tex
  fiberComposition: FiberComposition[]; // Final weighted composition
  spinTypes: SpinType[]; // All spin types used
  processes: ProcessType[]; // All processes applied
  color?: string; // If dyed
  isBleached: boolean;
  isMercerized: boolean;
}
