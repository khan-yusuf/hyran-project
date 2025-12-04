import type { Yarn } from '../../types';
import { BasicYarnDisplay } from './BasicYarnDisplay';
import { ProcessedYarnDisplay } from './ProcessedYarnDisplay';

interface YarnNodeProps {
  yarn: Yarn;
  depth?: number;
  className?: string;
}

/**
 * Recursive component that renders any yarn type
 * Delegates to specific display components based on yarn type
 */
export function YarnNode({ yarn, depth = 0, className = '' }: YarnNodeProps) {
  const indentStyle = {
    marginLeft: depth > 0 ? `${depth * 24}px` : '0',
  };

  return (
    <div className={className} style={indentStyle}>
      {yarn.type === 'basic' ? (
        <BasicYarnDisplay yarn={yarn} />
      ) : (
        <ProcessedYarnDisplay yarn={yarn} depth={depth} />
      )}
    </div>
  );
}
