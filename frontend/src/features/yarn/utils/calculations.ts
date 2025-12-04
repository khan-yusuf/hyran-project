import type {
  Yarn,
  YarnCount,
  CountSystem,
  FiberComposition,
  ComputedYarnProperties,
} from '../types/yarn.types';

// ============================================================================
// Tex Conversion
// ============================================================================

/**
 * Convert any yarn count system to tex
 * tex is the standard unit used for planning calculations
 */
export function convertToTex(count: YarnCount): number {
  const { value, system } = count;

  switch (system) {
    case 'tex':
      return value;
    case 'Ne':
      return 590.5 / value;
    case 'Nm':
      return 1000 / value;
    case 'Denier':
      return value / 9;
    case 'dtex':
      return value / 10;
    default:
      throw new Error(`Unknown count system: ${system}`);
  }
}

/**
 * Convert tex to any other count system
 */
export function convertFromTex(texValue: number, targetSystem: CountSystem): number {
  switch (targetSystem) {
    case 'tex':
      return texValue;
    case 'Ne':
      return 590.5 / texValue;
    case 'Nm':
      return 1000 / texValue;
    case 'Denier':
      return texValue * 9;
    case 'dtex':
      return texValue * 10;
    default:
      throw new Error(`Unknown count system: ${targetSystem}`);
  }
}

// ============================================================================
// Fiber Composition Calculation
// ============================================================================

/**
 * Normalize fiber composition percentages to sum to 100%
 * Handles floating point precision issues
 */
export function normalizeFiberComposition(composition: FiberComposition[]): FiberComposition[] {
  const total = composition.reduce((sum, fc) => sum + fc.percentage, 0);

  if (total === 0) return composition;

  return composition.map((fc) => ({
    ...fc,
    percentage: (fc.percentage / total) * 100,
  }));
}

/**
 * Combine multiple fiber compositions weighted by their yarn weights (in tex)
 * Used for ply, cable, and cover operations
 */
export function combineFiberCompositions(
  compositions: { composition: FiberComposition[]; weight: number }[]
): FiberComposition[] {
  const totalWeight = compositions.reduce((sum, c) => sum + c.weight, 0);

  if (totalWeight === 0) return [];

  // Aggregate by fiber type
  const fiberMap = new Map<string, number>();

  compositions.forEach(({ composition, weight }) => {
    composition.forEach((fc) => {
      const weightedPercentage = (fc.percentage / 100) * weight;
      const current = fiberMap.get(fc.fiber) || 0;
      fiberMap.set(fc.fiber, current + weightedPercentage);
    });
  });

  // Convert back to percentages
  const result: FiberComposition[] = Array.from(fiberMap.entries()).map(
    ([fiber, weightedAmount]) => ({
      fiber: fiber as FiberComposition['fiber'],
      percentage: (weightedAmount / totalWeight) * 100,
    })
  );

  return normalizeFiberComposition(result);
}

// ============================================================================
// Computed Properties
// ============================================================================

/**
 * Recursively calculate all computed properties for a yarn
 */
export function computeYarnProperties(yarn: Yarn): ComputedYarnProperties {
  switch (yarn.type) {
    case 'basic':
      return {
        texWeight: convertToTex(yarn.count),
        fiberComposition: normalizeFiberComposition(yarn.fiberComposition),
        spinTypes: [yarn.spinType],
        processes: [],
        isBleached: false,
        isMercerized: false,
      };

    case 'processed': {
      switch (yarn.process.type) {
        case 'dye': {
          const baseProps = computeYarnProperties(yarn.baseYarn);
          return {
            ...baseProps,
            processes: [...baseProps.processes, 'dye'],
            color: yarn.process.color,
          };
        }

        case 'bleach': {
          const baseProps = computeYarnProperties(yarn.baseYarn);
          return {
            ...baseProps,
            processes: [...baseProps.processes, 'bleach'],
            isBleached: true,
            color: undefined, // Bleaching removes color
          };
        }

        case 'mercerize': {
          const baseProps = computeYarnProperties(yarn.baseYarn);
          return {
            ...baseProps,
            processes: [...baseProps.processes, 'mercerize'],
            isMercerized: true,
          };
        }

        case 'ply':
        case 'cable': {
          const yarnProps = yarn.process.yarns.map(computeYarnProperties);
          const totalWeight = yarnProps.reduce((sum, p) => sum + p.texWeight, 0);
          const combinedComposition = combineFiberCompositions(
            yarnProps.map((p) => ({
              composition: p.fiberComposition,
              weight: p.texWeight,
            }))
          );
          const allSpinTypes = Array.from(
            new Set(yarnProps.flatMap((p) => p.spinTypes))
          );
          const allProcesses = Array.from(
            new Set([
              yarn.process.type,
              ...yarnProps.flatMap((p) => p.processes),
            ])
          );

          return {
            texWeight: totalWeight,
            fiberComposition: combinedComposition,
            spinTypes: allSpinTypes,
            processes: allProcesses,
            isBleached: yarnProps.some((p) => p.isBleached),
            isMercerized: yarnProps.some((p) => p.isMercerized),
            color: yarnProps.every((p) => p.color === yarnProps[0].color)
              ? yarnProps[0].color
              : undefined,
          };
        }

        case 'cover': {
          const coreProps = computeYarnProperties(yarn.process.coreYarn);
          const coverProps = computeYarnProperties(yarn.process.coveringYarn);
          const totalWeight = coreProps.texWeight + coverProps.texWeight;
          const combinedComposition = combineFiberCompositions([
            { composition: coreProps.fiberComposition, weight: coreProps.texWeight },
            { composition: coverProps.fiberComposition, weight: coverProps.texWeight },
          ]);

          return {
            texWeight: totalWeight,
            fiberComposition: combinedComposition,
            spinTypes: Array.from(
              new Set([...coreProps.spinTypes, ...coverProps.spinTypes])
            ),
            processes: Array.from(
              new Set([
                'cover',
                ...coreProps.processes,
                ...coverProps.processes,
              ])
            ),
            isBleached: coreProps.isBleached || coverProps.isBleached,
            isMercerized: coreProps.isMercerized || coverProps.isMercerized,
            color: coverProps.color, // Cover yarn determines visible color
          };
        }

        default: {
          const baseProps = computeYarnProperties(yarn.baseYarn);
          return baseProps;
        }
      }
    }

    default:
      throw new Error(`Unknown yarn type`);
  }
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Format fiber composition as a readable string
 * Example: "60% Cotton, 40% Polyester"
 */
export function formatFiberComposition(composition: FiberComposition[]): string {
  return composition
    .sort((a, b) => b.percentage - a.percentage)
    .map((fc) => `${fc.percentage.toFixed(1)}% ${fc.fiber.charAt(0).toUpperCase() + fc.fiber.slice(1)}`)
    .join(', ');
}

/**
 * Format tex weight with appropriate precision
 */
export function formatTexWeight(texWeight: number): string {
  return `${texWeight.toFixed(2)} tex`;
}
