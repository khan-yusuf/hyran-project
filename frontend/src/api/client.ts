import type { Item } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE}/items`);
    return handleResponse<Item[]>(response);
  },

  async getItem(id: number): Promise<Item> {
    const response = await fetch(`${API_BASE}/items/${id}`);
    return handleResponse<Item>(response);
  },

  async createItem(item: Item): Promise<Item> {
    const response = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse<Item>(response);
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse<{ status: string }>(response);
  },
};
