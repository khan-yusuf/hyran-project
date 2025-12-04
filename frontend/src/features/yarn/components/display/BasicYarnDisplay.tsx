import type { BasicYarn } from '../../types';
import { formatFiberComposition, convertToTex } from '../../utils';
import './YarnDisplay.css';

interface BasicYarnDisplayProps {
  yarn: BasicYarn;
}

export function BasicYarnDisplay({ yarn }: BasicYarnDisplayProps) {
  const texWeight = convertToTex(yarn.count);

  return (
    <div className="yarn-display basic-yarn">
      <div className="yarn-header">
        <span className="yarn-type-badge basic">Basic Yarn</span>
        {yarn.name && <span className="yarn-name">{yarn.name}</span>}
      </div>

      <div className="yarn-properties">
        <div className="property">
          <span className="property-label">Fiber Composition:</span>
          <span className="property-value">
            {formatFiberComposition(yarn.fiberComposition)}
          </span>
        </div>

        <div className="property">
          <span className="property-label">Count:</span>
          <span className="property-value">
            {yarn.count.value} {yarn.count.system}
          </span>
        </div>

        <div className="property">
          <span className="property-label">Weight (tex):</span>
          <span className="property-value">{texWeight.toFixed(2)} tex</span>
        </div>

        <div className="property">
          <span className="property-label">Spin Type:</span>
          <span className="property-value spin-type">
            {yarn.spinType.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>
      </div>
    </div>
  );
}
