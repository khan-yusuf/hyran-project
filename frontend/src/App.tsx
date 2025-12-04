import { useState } from 'react'
import { YarnNode, YarnSummaryCard } from './features/yarn/components/display'
import { YarnBuilder } from './features/yarn/components/builder'
import {
  complexYarn,
  basicYarns,
  compositeYarns,
  complexYarns,
} from './features/yarn/mocks'
import type { Yarn } from './features/yarn/types'
import './App.css'

type ViewMode = 'builder' | 'demo';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('builder')
  const [selectedYarn, setSelectedYarn] = useState<Yarn>(complexYarn)

  return (
    <div>
      <h1>Hyran Yarn Library</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div className="tab-buttons" style={{ display: 'inline-flex', gap: '8px', background: '#f0f0f0', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('builder')}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              background: viewMode === 'builder' ? '#1976d2' : 'transparent',
              color: viewMode === 'builder' ? 'white' : '#666',
              transition: 'all 0.2s',
            }}
          >
            Yarn Builder
          </button>
          <button
            onClick={() => setViewMode('demo')}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              background: viewMode === 'demo' ? '#1976d2' : 'transparent',
              color: viewMode === 'demo' ? 'white' : '#666',
              transition: 'all 0.2s',
            }}
          >
            Example Yarns
          </button>
        </div>
      </div>

      {viewMode === 'builder' ? (
        <YarnBuilder />
      ) : (
        <div className="card" style={{ textAlign: 'left' }}>
          <h2>Yarn Display Demo</h2>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="yarn-select" style={{ fontWeight: 'bold', marginRight: '10px' }}>
              Select a yarn to view:
            </label>
            <select
              id="yarn-select"
              onChange={(e) => {
                const yarns = [...basicYarns, ...compositeYarns, ...complexYarns]
                const yarn = yarns.find((y) => y.id === e.target.value)
                if (yarn) setSelectedYarn(yarn)
              }}
              value={selectedYarn.id}
              style={{ padding: '8px', fontSize: '14px', borderRadius: '4px' }}
            >
              <optgroup label="Basic Yarns">
                {basicYarns.map((yarn) => (
                  <option key={yarn.id} value={yarn.id}>
                    {yarn.name || yarn.id}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Composite Yarns">
                {compositeYarns.map((yarn) => (
                  <option key={yarn.id} value={yarn.id}>
                    {yarn.name || yarn.id}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Complex Multi-Process Yarns">
                {complexYarns.map((yarn) => (
                  <option key={yarn.id} value={yarn.id}>
                    {yarn.name || yarn.id}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <YarnSummaryCard yarn={selectedYarn} />

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Yarn Structure</h3>
            <YarnNode yarn={selectedYarn} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
