import { useState } from 'react';
import type { Yarn, ProcessedYarn, ProcessType } from '../../types';
import { PROCESS_TYPES, SIMPLE_PROCESSES, COMPOSITE_PROCESSES } from '../../constants';
import './YarnBuilder.css';

interface ProcessApplierProps {
  availableYarns: Yarn[];
  onYarnCreated: (yarn: ProcessedYarn) => void;
  onCancel?: () => void;
}

export function ProcessApplier({ availableYarns, onYarnCreated, onCancel }: ProcessApplierProps) {
  const [processType, setProcessType] = useState<ProcessType>('dye');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000080');
  const [selectedYarnIds, setSelectedYarnIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const isSimpleProcess = SIMPLE_PROCESSES.some((p) => p.value === processType);
  const isCompositeProcess = COMPOSITE_PROCESSES.some((p) => p.value === processType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a yarn name');
      return;
    }

    if (isSimpleProcess && selectedYarnIds.length !== 1) {
      setError('Please select exactly one base yarn');
      return;
    }

    if (processType === 'cover' && selectedYarnIds.length !== 2) {
      setError('Cover process requires exactly 2 yarns (core and covering)');
      return;
    }

    if ((processType === 'ply' || processType === 'cable') && selectedYarnIds.length < 2) {
      setError('Ply/Cable requires at least 2 yarns');
      return;
    }

    const selectedYarns = selectedYarnIds
      .map((id) => availableYarns.find((y) => y.id === id))
      .filter((y): y is Yarn => y !== undefined);

    let yarn: ProcessedYarn;

    try {
      switch (processType) {
        case 'dye':
          yarn = {
            type: 'processed',
            id: `yarn-${Date.now()}`,
            name: name.trim(),
            baseYarn: selectedYarns[0],
            process: { type: 'dye', color },
          };
          break;

        case 'bleach':
          yarn = {
            type: 'processed',
            id: `yarn-${Date.now()}`,
            name: name.trim(),
            baseYarn: selectedYarns[0],
            process: { type: 'bleach' },
          };
          break;

        case 'mercerize':
          yarn = {
            type: 'processed',
            id: `yarn-${Date.now()}`,
            name: name.trim(),
            baseYarn: selectedYarns[0],
            process: { type: 'mercerize' },
          };
          break;

        case 'ply':
          yarn = {
            type: 'processed',
            id: `yarn-${Date.now()}`,
            name: name.trim(),
            baseYarn: selectedYarns[0], // Required by type, but not used
            process: { type: 'ply', yarns: selectedYarns },
          };
          break;

        case 'cable':
          yarn = {
            type: 'processed',
            id: `yarn-${Date.now()}`,
            name: name.trim(),
            baseYarn: selectedYarns[0], // Required by type, but not used
            process: { type: 'cable', yarns: selectedYarns },
          };
          break;

        case 'cover':
          yarn = {
            type: 'processed',
            id: `yarn-${Date.now()}`,
            name: name.trim(),
            baseYarn: selectedYarns[0], // Required by type, but not used
            process: {
              type: 'cover',
              coreYarn: selectedYarns[0],
              coveringYarn: selectedYarns[1],
            },
          };
          break;

        default:
          setError('Invalid process type');
          return;
      }

      onYarnCreated(yarn);

      // Reset form
      setName('');
      setSelectedYarnIds([]);
      setColor('#000080');
    } catch (err) {
      setError('Failed to create yarn: ' + (err as Error).message);
    }
  };

  const toggleYarnSelection = (yarnId: string) => {
    if (isSimpleProcess) {
      setSelectedYarnIds([yarnId]);
    } else if (processType === 'cover') {
      if (selectedYarnIds.includes(yarnId)) {
        setSelectedYarnIds(selectedYarnIds.filter((id) => id !== yarnId));
      } else if (selectedYarnIds.length < 2) {
        setSelectedYarnIds([...selectedYarnIds, yarnId]);
      } else {
        setSelectedYarnIds([selectedYarnIds[1], yarnId]);
      }
    } else {
      // Ply/Cable - allow multiple
      if (selectedYarnIds.includes(yarnId)) {
        setSelectedYarnIds(selectedYarnIds.filter((id) => id !== yarnId));
      } else {
        setSelectedYarnIds([...selectedYarnIds, yarnId]);
      }
    }
  };

  if (availableYarns.length === 0) {
    return (
      <div className="yarn-form">
        <h3>Apply Process to Yarn</h3>
        <div className="info-message">
          Please create at least one basic yarn before applying processes.
        </div>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Back
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="yarn-form">
      <h3>Apply Process to Yarn</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="process-name">
          Yarn Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="process-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Navy Blue Cotton"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="process-type">
          Process Type <span className="required">*</span>
        </label>
        <select
          id="process-type"
          value={processType}
          onChange={(e) => {
            setProcessType(e.target.value as ProcessType);
            setSelectedYarnIds([]);
          }}
        >
          {PROCESS_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {processType === 'dye' && (
        <div className="form-group">
          <label htmlFor="dye-color">
            Color <span className="required">*</span>
          </label>
          <div className="color-input-wrapper">
            <input
              type="color"
              id="dye-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#000000"
              className="color-text-input"
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label>
          Select Yarn{isCompositeProcess && 's'}{' '}
          <span className="required">*</span>
        </label>
        <div className="yarn-selection-info">
          {isSimpleProcess && 'Select the base yarn to process'}
          {processType === 'cover' && 'Select 2 yarns (first = core, second = covering)'}
          {(processType === 'ply' || processType === 'cable') &&
            'Select 2 or more yarns to combine'}
        </div>

        <div className="yarn-list">
          {availableYarns.map((yarn, index) => {
            const isSelected = selectedYarnIds.includes(yarn.id);
            const selectionOrder = selectedYarnIds.indexOf(yarn.id) + 1;

            return (
              <div
                key={yarn.id}
                className={`yarn-list-item ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleYarnSelection(yarn.id)}
              >
                <div className="yarn-list-item-content">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="yarn-checkbox"
                  />
                  <div className="yarn-list-item-info">
                    <span className="yarn-list-item-name">{yarn.name || `Yarn ${index + 1}`}</span>
                    {isSelected && processType === 'cover' && (
                      <span className="yarn-role-badge">
                        {selectionOrder === 1 ? 'Core' : 'Covering'}
                      </span>
                    )}
                    {isSelected && (processType === 'ply' || processType === 'cable') && (
                      <span className="yarn-role-badge">#{selectionOrder}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Apply Process
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
