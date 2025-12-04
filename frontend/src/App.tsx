import { useQuery } from '@tanstack/react-query'
import { api } from './api/client'
import type { Item } from './types'
import './App.css'

function App() {
  const { data: items, isLoading, error } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: api.getItems,
  })

  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: api.healthCheck,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>
  }

  return (
    <div>
      <h1>Hyran Project</h1>

      <div className="card">
        <h2>API Status</h2>
        <p>Backend health: {health?.status || 'checking...'}</p>
      </div>

      <div className="card">
        <h2>Items from Backend</h2>
        {items && items.length > 0 ? (
          <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            {items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>: {item.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found</p>
        )}
      </div>

      <p className="read-the-docs">
        Edit src/App.tsx or backend/src/app.py to test hot reload
      </p>
    </div>
  )
}

export default App
