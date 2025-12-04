import { useState } from 'react';
import type { BasicYarn, FiberComposition, CountSystem, SpinType } from '../../types';
import { COUNT_SYSTEMS, SPIN_TYPES } from '../../constants';
import { FiberCompositionInput } from './FiberCompositionInput';
import { isValidFiberComposition } from '../../utils';
import './YarnBuilder.css';

interface BasicYarnFormProps {
  onYarnCreated: (yarn: BasicYarn) => void;
  onCancel?: () => void;
}

export function BasicYarnForm({ onYarnCreated, onCancel }: BasicYarnFormProps) {
  const [name, setName] = useState('');
  const [fiberComposition, setFiberComposition] = useState<FiberComposition[]>([
    { fiber: 'cotton', percentage: 100 },
  ]);
  const [countValue, setCountValue] = useState<number>(30);
  const [countSystem, setCountSystem] = useState<CountSystem>('Ne');
  const [spinType, setSpinType] = useState<SpinType>('ring_spun');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate fiber composition
    if (!isValidFiberComposition(fiberComposition)) {
      setError('Fiber composition must sum to 100%');
      return;
    }

    if (countValue <= 0) {
      setError('Count value must be positive');
      return;
    }

    if (!name.trim()) {
      setError('Please enter a yarn name');
      return;
    }

    const yarn: BasicYarn = {
      type: 'basic',
      id: `yarn-${Date.now()}`,
      name: name.trim(),
      fiberComposition,
      count: { value: countValue, system: countSystem },
      spinType,
    };

    onYarnCreated(yarn);

    // Reset form
    setName('');
    setFiberComposition([{ fiber: 'cotton', percentage: 100 }]);
    setCountValue(30);
    setCountSystem('Ne');
    setSpinType('ring_spun');
  };

  return (
    <form onSubmit={handleSubmit} className="yarn-form">
      <h3>Create Basic Yarn</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="yarn-name">
          Yarn Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="yarn-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., 30/1 Cotton"
          required
        />
      </div>

      <div className="form-group">
        <label>
          Fiber Composition <span className="required">*</span>
        </label>
        <FiberCompositionInput
          value={fiberComposition}
          onChange={setFiberComposition}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="count-value">
            Count Value <span className="required">*</span>
          </label>
          <input
            type="number"
            id="count-value"
            value={countValue}
            onChange={(e) => setCountValue(parseFloat(e.target.value))}
            step="0.1"
            min="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="count-system">
            Count System <span className="required">*</span>
          </label>
          <select
            id="count-system"
            value={countSystem}
            onChange={(e) => setCountSystem(e.target.value as CountSystem)}
          >
            {COUNT_SYSTEMS.map((system) => (
              <option key={system.value} value={system.value}>
                {system.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="spin-type">
          Spin Type <span className="required">*</span>
        </label>
        <select
          id="spin-type"
          value={spinType}
          onChange={(e) => setSpinType(e.target.value as SpinType)}
        >
          {SPIN_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Create Yarn
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
