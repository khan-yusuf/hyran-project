import type { ProcessedYarn } from '../../types';
import { YarnNode } from './YarnNode';
import './YarnDisplay.css';

interface ProcessedYarnDisplayProps {
  yarn: ProcessedYarn;
  depth: number;
}

export function ProcessedYarnDisplay({ yarn, depth }: ProcessedYarnDisplayProps) {
  const process = yarn.process;

  const renderProcessInfo = () => {
    switch (process.type) {
      case 'dye':
        return (
          <div className="process-info dye">
            <span className="process-label">Dyed Color:</span>
            <span className="process-value">
              <span
                className="color-swatch"
                style={{ backgroundColor: process.color }}
              />
              {process.color}
            </span>
          </div>
        );

      case 'bleach':
        return (
          <div className="process-info bleach">
            <span className="process-label">Process:</span>
            <span className="process-value">Bleached</span>
          </div>
        );

      case 'mercerize':
        return (
          <div className="process-info mercerize">
            <span className="process-label">Process:</span>
            <span className="process-value">Mercerized</span>
          </div>
        );

      case 'ply':
        return (
          <div className="process-info ply">
            <span className="process-label">Process:</span>
            <span className="process-value">
              {process.yarns.length}-Ply (twisted together)
            </span>
          </div>
        );

      case 'cable':
        return (
          <div className="process-info cable">
            <span className="process-label">Process:</span>
            <span className="process-value">
              {process.yarns.length}-Cable (alternating twist)
            </span>
          </div>
        );

      case 'cover':
        return (
          <div className="process-info cover">
            <span className="process-label">Process:</span>
            <span className="process-value">Covered (wrapped)</span>
          </div>
        );
    }
  };

  const renderChildYarns = () => {
    switch (process.type) {
      case 'dye':
      case 'bleach':
      case 'mercerize':
        return (
          <div className="child-yarns">
            <div className="child-yarn-label">Base Yarn:</div>
            <YarnNode yarn={yarn.baseYarn} depth={depth + 1} />
          </div>
        );

      case 'ply':
      case 'cable':
        return (
          <div className="child-yarns">
            <div className="child-yarn-label">Component Yarns:</div>
            {process.yarns.map((childYarn, index) => (
              <div key={childYarn.id || index} className="child-yarn-item">
                <span className="child-yarn-index">{index + 1}.</span>
                <YarnNode yarn={childYarn} depth={depth + 1} />
              </div>
            ))}
          </div>
        );

      case 'cover':
        return (
          <div className="child-yarns">
            <div className="child-yarn-section">
              <div className="child-yarn-label">Core Yarn:</div>
              <YarnNode yarn={process.coreYarn} depth={depth + 1} />
            </div>
            <div className="child-yarn-section">
              <div className="child-yarn-label">Covering Yarn:</div>
              <YarnNode yarn={process.coveringYarn} depth={depth + 1} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`yarn-display processed-yarn process-${process.type}`}>
      <div className="yarn-header">
        <span className={`yarn-type-badge ${process.type}`}>
          {process.type.charAt(0).toUpperCase() + process.type.slice(1)} Yarn
        </span>
        {yarn.name && <span className="yarn-name">{yarn.name}</span>}
      </div>

      {renderProcessInfo()}
      {renderChildYarns()}
    </div>
  );
}
