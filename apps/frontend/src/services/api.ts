import { StudyItem } from '../types/study'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchStudyItems(): Promise<StudyItem[]> {
  const res = await fetch(`${API_BASE_URL}/study-items`)
  if (!res.ok) {
    throw new Error(`Failed to fetch study items (${res.status})`)
  }
  return res.json()
}

export async function fetchStudyItem(id: string): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch study item ${id} (${res.status})`)
  }
  return res.json()
}

export async function createStudyItem(
  data: Omit<StudyItem, 'id' | 'log'>
): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to create study item (${res.status})`)
  }
  return res.json()
}

export async function updateStudyItem(
  id: string,
  data: Partial<Omit<StudyItem, 'id' | 'log'>>
): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to update study item ${id} (${res.status})`)
  }
  return res.json()
}

export async function deleteStudyItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(`Failed to delete study item ${id} (${res.status})`)
  }
}

export async function addProgressLog(
  id: string,
  logData: { amount: number; minutes: number; note?: string; date?: string }
): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  })
  if (!res.ok) {
    throw new Error(`Failed to add progress log for item ${id} (${res.status})`)
  }
  return res.json()
}

export async function togglePauseStudyItem(id: string): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}/toggle-pause`, {
    method: 'PATCH',
  })
  if (!res.ok) {
    throw new Error(`Failed to toggle pause status for item ${id} (${res.status})`)
  }
  return res.json()
}
