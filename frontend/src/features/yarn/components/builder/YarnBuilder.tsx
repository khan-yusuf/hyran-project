import { useState } from 'react';
import type { Yarn, BasicYarn, ProcessedYarn } from '../../types';
import { BasicYarnForm } from './BasicYarnForm';
import { ProcessApplier } from './ProcessApplier';
import { YarnNode, YarnSummaryCard } from '../display';
import { computeYarnProperties } from '../../utils';
import './YarnBuilder.css';

type BuilderMode = 'list' | 'create-basic' | 'apply-process' | 'preview';

export function YarnBuilder() {
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [mode, setMode] = useState<BuilderMode>('list');
  const [previewYarn, setPreviewYarn] = useState<Yarn | null>(null);

  const handleBasicYarnCreated = (yarn: BasicYarn) => {
    setYarns([...yarns, yarn]);
    setMode('list');
  };

  const handleProcessedYarnCreated = (yarn: ProcessedYarn) => {
    setYarns([...yarns, yarn]);
    setMode('list');
  };

  const handleDeleteYarn = (yarnId: string) => {
    if (confirm('Are you sure you want to delete this yarn?')) {
      setYarns(yarns.filter((y) => y.id !== yarnId));
    }
  };

  const handlePreviewYarn = (yarn: Yarn) => {
    setPreviewYarn(yarn);
    setMode('preview');
  };

  const renderContent = () => {
    switch (mode) {
      case 'create-basic':
        return (
          <BasicYarnForm
            onYarnCreated={handleBasicYarnCreated}
            onCancel={() => setMode('list')}
          />
        );

      case 'apply-process':
        return (
          <ProcessApplier
            availableYarns={yarns}
            onYarnCreated={handleProcessedYarnCreated}
            onCancel={() => setMode('list')}
          />
        );

      case 'preview':
        return previewYarn ? (
          <div className="yarn-preview">
            <div className="preview-header">
              <h3>Yarn Preview</h3>
              <button className="btn btn-secondary" onClick={() => setMode('list')}>
                Back to List
              </button>
            </div>
            <YarnSummaryCard yarn={previewYarn} />
            <div style={{ marginTop: '20px' }}>
              <h4>Yarn Structure</h4>
              <YarnNode yarn={previewYarn} />
            </div>
          </div>
        ) : null;

      case 'list':
      default:
        return (
          <div className="yarn-list-view">
            <div className="builder-header">
              <h3>Your Yarns ({yarns.length})</h3>
              <div className="builder-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setMode('create-basic')}
                >
                  + Create Basic Yarn
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setMode('apply-process')}
                  disabled={yarns.length === 0}
                >
                  + Apply Process
                </button>
              </div>
            </div>

            {yarns.length === 0 ? (
              <div className="empty-state">
                <p>No yarns created yet.</p>
                <p>Click "Create Basic Yarn" to get started!</p>
              </div>
            ) : (
              <div className="yarns-grid">
                {yarns.map((yarn, index) => {
                  const props = computeYarnProperties(yarn);
                  return (
                    <div key={yarn.id} className="yarn-card">
                      <div className="yarn-card-header">
                        <h4>{yarn.name || `Yarn ${index + 1}`}</h4>
                        <span className={`yarn-type-tag ${yarn.type}`}>
                          {yarn.type === 'basic' ? 'Basic' : 'Processed'}
                        </span>
                      </div>

                      <div className="yarn-card-body">
                        <div className="yarn-card-property">
                          <span className="label">Weight:</span>
                          <span className="value">{props.texWeight.toFixed(2)} tex</span>
                        </div>
                        <div className="yarn-card-property">
                          <span className="label">Composition:</span>
                          <span className="value composition-value">
                            {props.fiberComposition
                              .slice(0, 2)
                              .map((fc) => `${fc.percentage.toFixed(0)}% ${fc.fiber}`)
                              .join(', ')}
                            {props.fiberComposition.length > 2 && '...'}
                          </span>
                        </div>
                        {yarn.type === 'processed' && props.processes.length > 0 && (
                          <div className="yarn-card-property">
                            <span className="label">Processes:</span>
                            <span className="value">
                              {props.processes.slice(0, 2).join(', ')}
                              {props.processes.length > 2 && '...'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="yarn-card-actions">
                        <button
                          className="btn-text"
                          onClick={() => handlePreviewYarn(yarn)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn-text danger"
                          onClick={() => handleDeleteYarn(yarn.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="yarn-builder">
      {renderContent()}
    </div>
  );
}
