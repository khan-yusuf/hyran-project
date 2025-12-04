# Yarn Module Type System

## Overview

This module implements a comprehensive type system for yarn definition and management in the Hyran fabric mill planning application. Yarns are represented as a **recursive tree structure**, where complex yarns are built from simpler base yarns through various processes.

## Type Architecture

### Core Yarn Types

The system uses a **discriminated union** pattern for type safety:

```typescript
type Yarn = BasicYarn | ProcessedYarn;
```

#### BasicYarn
Represents a yarn spun from raw fibers:
- `fiberComposition`: Array of fibers with percentages (must sum to 100%)
- `count`: Yarn weight in any standard count system
- `spinType`: Method used to spin the yarn (ring spun, air jet, etc.)

#### ProcessedYarn
Represents a yarn that has undergone processing:
- `baseYarn`: The yarn being processed (for simple processes)
- `process`: One of: dye, bleach, mercerize, ply, cable, cover

### Process Types

**Simple Processes** (modify a single yarn):
- `DyeProcess`: Changes color
- `BleachProcess`: Removes natural color
- `MercerizeProcess`: Chemical treatment for luster/strength

**Composite Processes** (combine multiple yarns):
- `PlyProcess`: Twist 2+ yarns together
- `CableProcess`: Like ply with alternating twist
- `CoverProcess`: Wrap one yarn around another

## Key Design Decisions

### 1. Recursive Structure
Yarns contain yarns, allowing infinite composition depth:
```
Processed Yarn (Dye: Blue)
  └─ Processed Yarn (Ply)
      ├─ Basic Yarn (Cotton)
      └─ Basic Yarn (Polyester)
```

### 2. Computed Properties
Final properties (tex weight, fiber composition) are **calculated on-demand**, not stored:
- Prevents data inconsistency
- Single source of truth
- Automatic updates when base yarns change

### 3. Count System Conversion
All calculations use **tex** as the standard unit:
- `convertToTex()`: Converts Ne, Nm, Denier, dtex → tex
- `convertFromTex()`: Converts tex → any other system

### 4. Weighted Fiber Composition
When combining yarns, fiber percentages are weighted by yarn weight:
```
30 tex Cotton + 20 tex Nylon = 50 tex (60% Cotton, 40% Nylon)
```

## File Structure

```
features/yarn/
├── types/
│   └── yarn.types.ts          # TypeScript interfaces and types
├── constants/
│   └── yarn.constants.ts      # Predefined options (fibers, spin types, etc.)
├── utils/
│   ├── calculations.ts        # Tex conversion, fiber composition
│   └── validators.ts          # Validation logic
└── index.ts                   # Main exports
```

## Usage Examples

### Creating a Basic Yarn

```typescript
import { BasicYarn } from '@/features/yarn';

const cottonYarn: BasicYarn = {
  type: 'basic',
  id: 'yarn-1',
  name: '30/1 Cotton',
  fiberComposition: [
    { fiber: 'cotton', percentage: 100 }
  ],
  count: { value: 30, system: 'Ne' },
  spinType: 'ring_spun',
};
```

### Creating a Composite Yarn

```typescript
import { ProcessedYarn } from '@/features/yarn';

const pliedYarn: ProcessedYarn = {
  type: 'processed',
  id: 'yarn-2',
  name: '2-Ply Cotton/Polyester',
  baseYarn: cottonYarn, // Not used for composite, but required by type
  process: {
    type: 'ply',
    yarns: [cottonYarn, polyesterYarn],
  },
};
```

### Computing Properties

```typescript
import { computeYarnProperties, formatFiberComposition } from '@/features/yarn';

const props = computeYarnProperties(pliedYarn);

console.log(props.texWeight);           // Combined weight in tex
console.log(formatFiberComposition(props.fiberComposition));
// "60% Cotton, 40% Polyester"
```

### Validation

```typescript
import { isValidYarn, getYarnValidationErrors } from '@/features/yarn';

if (!isValidYarn(yarn)) {
  const errors = getYarnValidationErrors(yarn);
  console.error('Validation errors:', errors);
}
```

## Next Steps

With the type system in place, the next steps are:

1. **Display Components**: Create React components to recursively display yarn trees
2. **Builder Components**: Create forms for building yarns interactively
3. **Hooks**: Create React hooks like `useYarnCalculations` for computed properties
4. **API Integration**: Connect to backend for persisting yarns

## Technical Notes

- All IDs should be UUIDs or similar unique identifiers
- Fiber composition percentages use floating point; validation uses 0.01% tolerance
- Circular references are detected and rejected by validators
- Color is inherited in composites only if all constituent yarns share the same color
