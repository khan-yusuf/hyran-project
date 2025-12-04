import type { Yarn, ComputedYarnProperties } from '../../types';
import { computeYarnProperties, formatFiberComposition, formatTexWeight } from '../../utils';
import './YarnDisplay.css';

interface YarnSummaryCardProps {
  yarn: Yarn;
  className?: string;
}

/**
 * Displays the computed final properties of a yarn
 * Shows the end result after all processes are applied
 */
export function YarnSummaryCard({ yarn, className = '' }: YarnSummaryCardProps) {
  const props: ComputedYarnProperties = computeYarnProperties(yarn);

  return (
    <div className={`yarn-summary-card ${className}`}>
      <h3 className="summary-title">Final Yarn Properties</h3>

      <div className="summary-grid">
        <div className="summary-item primary">
          <span className="summary-label">Final Weight:</span>
          <span className="summary-value weight">{formatTexWeight(props.texWeight)}</span>
        </div>

        <div className="summary-item primary">
          <span className="summary-label">Fiber Composition:</span>
          <span className="summary-value composition">
            {formatFiberComposition(props.fiberComposition)}
          </span>
        </div>

        {props.spinTypes.length > 0 && (
          <div className="summary-item">
            <span className="summary-label">Spin Types:</span>
            <span className="summary-value">
              {props.spinTypes
                .map((st) => st.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
                .join(', ')}
            </span>
          </div>
        )}

        {props.processes.length > 0 && (
          <div className="summary-item">
            <span className="summary-label">Processes Applied:</span>
            <span className="summary-value processes">
              {props.processes
                .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                .join(' → ')}
            </span>
          </div>
        )}

        {props.color && (
          <div className="summary-item">
            <span className="summary-label">Color:</span>
            <span className="summary-value color">
              <span
                className="color-swatch"
                style={{ backgroundColor: props.color }}
              />
              {props.color}
            </span>
          </div>
        )}

        {props.isBleached && (
          <div className="summary-item">
            <span className="summary-badge bleached">Bleached</span>
          </div>
        )}

        {props.isMercerized && (
          <div className="summary-item">
            <span className="summary-badge mercerized">Mercerized</span>
          </div>
        )}
      </div>
    </div>
  );
}
