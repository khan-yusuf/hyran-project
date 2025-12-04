import type { FiberComposition, FiberType } from '../../types';
import { ALL_FIBERS } from '../../constants';
import './YarnBuilder.css';

interface FiberCompositionInputProps {
  value: FiberComposition[];
  onChange: (composition: FiberComposition[]) => void;
}

export function FiberCompositionInput({ value, onChange }: FiberCompositionInputProps) {
  const totalPercentage = value.reduce((sum, fc) => sum + fc.percentage, 0);

  const handleFiberChange = (index: number, fiber: FiberType) => {
    const newComposition = [...value];
    newComposition[index] = { ...newComposition[index], fiber };
    onChange(newComposition);
  };

  const handlePercentageChange = (index: number, percentage: number) => {
    // Ensure percentage is at least 0.1 (no 0% fibers allowed)
    const validPercentage = percentage <= 0 ? 0.1 : Math.min(100, percentage);
    const newComposition = [...value];
    newComposition[index] = { ...newComposition[index], percentage: validPercentage };
    onChange(newComposition);
  };

  const addFiber = () => {
    const remainingPercentage = Math.max(0, 100 - totalPercentage);
    // Don't allow adding if less than 1% remaining
    if (remainingPercentage < 1) {
      return;
    }

    const usedFibers = new Set(value.map((fc) => fc.fiber));
    const availableFiber = ALL_FIBERS.find((f) => !usedFibers.has(f.value))?.value || 'cotton';

    onChange([...value, { fiber: availableFiber, percentage: Math.max(1, remainingPercentage) }]);
  };

  const canAddMoreFibers = value.length < ALL_FIBERS.length && (100 - totalPercentage) >= 1;

  const removeFiber = (index: number) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fiber-composition-input">
      {value.map((fc, index) => (
        <div key={index} className="fiber-row">
          <select
            value={fc.fiber}
            onChange={(e) => handleFiberChange(index, e.target.value as FiberType)}
            className="fiber-select"
          >
            {ALL_FIBERS.map((fiber) => (
              <option key={fiber.value} value={fiber.value}>
                {fiber.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={fc.percentage}
            onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value) || 0.1)}
            min="0.1"
            max="100"
            step="0.1"
            className="percentage-input"
          />
          <span className="percentage-symbol">%</span>

          {value.length > 1 && (
            <button
              type="button"
              onClick={() => removeFiber(index)}
              className="btn-remove"
              aria-label="Remove fiber"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <div className="fiber-composition-footer">
        <div className={`total-percentage ${totalPercentage !== 100 ? 'invalid' : ''}`}>
          Total: {totalPercentage.toFixed(1)}%
          {totalPercentage !== 100 && ' (must equal 100%)'}
        </div>

        {canAddMoreFibers ? (
          <button type="button" onClick={addFiber} className="btn-add">
            + Add Fiber
          </button>
        ) : value.length < ALL_FIBERS.length && (
          <span className="fiber-hint">
            (Adjust percentages to add more fibers)
          </span>
        )}
      </div>
    </div>
  );
}
