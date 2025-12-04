import type { FiberComposition, Yarn } from '../types/yarn.types';

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate that fiber composition percentages sum to 100% (within tolerance)
 */
export function isValidFiberComposition(
  composition: FiberComposition[],
  tolerance = 0.01
): boolean {
  if (composition.length === 0) return false;

  const total = composition.reduce((sum, fc) => sum + fc.percentage, 0);
  return Math.abs(total - 100) < tolerance;
}

/**
 * Validate that all fiber percentages are positive
 */
export function hasPositivePercentages(composition: FiberComposition[]): boolean {
  return composition.every((fc) => fc.percentage > 0);
}

/**
 * Validate yarn count value is positive
 */
export function isValidCountValue(value: number): boolean {
  return value > 0 && isFinite(value);
}

/**
 * Validate that a yarn structure has no circular references
 */
export function hasNoCircularReferences(yarn: Yarn, visited = new Set<string>()): boolean {
  if (visited.has(yarn.id)) {
    return false; // Circular reference detected
  }

  visited.add(yarn.id);

  if (yarn.type === 'processed') {
    switch (yarn.process.type) {
      case 'ply':
      case 'cable':
        return yarn.process.yarns.every((y) =>
          hasNoCircularReferences(y, new Set(visited))
        );
      case 'cover':
        return (
          hasNoCircularReferences(yarn.process.coreYarn, new Set(visited)) &&
          hasNoCircularReferences(yarn.process.coveringYarn, new Set(visited))
        );
      default:
        return hasNoCircularReferences(yarn.baseYarn, new Set(visited));
    }
  }

  return true;
}

/**
 * Validate that composite processes have at least 2 yarns
 */
export function isValidCompositeProcess(yarns: Yarn[]): boolean {
  return yarns.length >= 2;
}

/**
 * Get all validation errors for a yarn
 */
export function getYarnValidationErrors(yarn: Yarn): string[] {
  const errors: string[] = [];

  switch (yarn.type) {
    case 'basic':
      if (!isValidFiberComposition(yarn.fiberComposition)) {
        errors.push('Fiber composition must sum to 100%');
      }
      if (!hasPositivePercentages(yarn.fiberComposition)) {
        errors.push('All fiber percentages must be positive');
      }
      if (!isValidCountValue(yarn.count.value)) {
        errors.push('Yarn count must be a positive number');
      }
      break;

    case 'processed':
      if (yarn.process.type === 'ply' || yarn.process.type === 'cable') {
        if (!isValidCompositeProcess(yarn.process.yarns)) {
          errors.push(`${yarn.process.type} requires at least 2 yarns`);
        }
      }
      // Recursively validate base yarns
      if (yarn.process.type === 'dye' || yarn.process.type === 'bleach' || yarn.process.type === 'mercerize') {
        errors.push(...getYarnValidationErrors(yarn.baseYarn));
      } else if (yarn.process.type === 'ply' || yarn.process.type === 'cable') {
        yarn.process.yarns.forEach((y) => {
          errors.push(...getYarnValidationErrors(y));
        });
      } else if (yarn.process.type === 'cover') {
        errors.push(...getYarnValidationErrors(yarn.process.coreYarn));
        errors.push(...getYarnValidationErrors(yarn.process.coveringYarn));
      }
      break;
  }

  if (!hasNoCircularReferences(yarn)) {
    errors.push('Circular reference detected in yarn structure');
  }

  return errors;
}

/**
 * Check if a yarn is valid
 */
export function isValidYarn(yarn: Yarn): boolean {
  return getYarnValidationErrors(yarn).length === 0;
}
