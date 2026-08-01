import { Capacitor } from '@capacitor/core';
import { StudyItem, UserSettings } from '../types/study';
import { supabase } from '../lib/supabaseClient';

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// The Android emulator's "localhost" refers to the emulated device itself,
// not the host machine — 10.0.2.2 is the special alias back to the host.
const API_BASE_URL =
  Capacitor.getPlatform() === 'android'
    ? configuredBaseUrl.replace('localhost', '10.0.2.2')
    : configuredBaseUrl;

async function authHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export async function fetchStudyItems(): Promise<StudyItem[]> {
  const res = await fetch(`${API_BASE_URL}/study-items`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch study items (${res.status})`);
  }
  return res.json() as Promise<StudyItem[]>;
}

export async function fetchStudyItem(id: string): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch study item ${id} (${res.status})`);
  }
  return res.json() as Promise<StudyItem>;
}

export async function createStudyItem(
  data: Omit<StudyItem, 'id' | 'log'>,
): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create study item (${res.status})`);
  }
  return res.json() as Promise<StudyItem>;
}

export async function updateStudyItem(
  id: string,
  data: Partial<Omit<StudyItem, 'id' | 'log'>>,
): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update study item ${id} (${res.status})`);
  }
  return res.json() as Promise<StudyItem>;
}

export async function deleteStudyItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to delete study item ${id} (${res.status})`);
  }
}

export async function addProgressLog(
  id: string,
  logData: { amount: number; minutes: number; note?: string; date?: string },
): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(logData),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to add progress log for item ${id} (${res.status})`,
    );
  }
  return res.json() as Promise<StudyItem>;
}

export async function togglePauseStudyItem(id: string): Promise<StudyItem> {
  const res = await fetch(`${API_BASE_URL}/study-items/${id}/toggle-pause`, {
    method: 'PATCH',
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to toggle pause status for item ${id} (${res.status})`,
    );
  }
  return res.json() as Promise<StudyItem>;
}

export async function fetchUserSettings(): Promise<UserSettings> {
  const res = await fetch(`${API_BASE_URL}/user-settings`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user settings (${res.status})`);
  }
  return res.json() as Promise<UserSettings>;
}

export async function updateUserSettings(
  data: UserSettings,
): Promise<UserSettings> {
  const res = await fetch(`${API_BASE_URL}/user-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update user settings (${res.status})`);
  }
  return res.json() as Promise<UserSettings>;
}
