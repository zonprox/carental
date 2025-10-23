import type {
  CarFormData,
  AuthResponse,
  CarResponse,
  CarsResponse,
  HealthResponse,
  SetupData,
  SetupResponse,
  CarFilters,
} from '@/types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.details?.[0]?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Health
  health: () => fetchJSON<HealthResponse>(`${API_BASE}/health`),

  // Setup
  setup: {
    get: () => fetchJSON<SetupResponse>(`${API_BASE}/setup`),
    save: (data: SetupData) =>
      fetchJSON<SetupResponse>(`${API_BASE}/setup`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    testDb: (data: Partial<SetupData>) =>
      fetchJSON<{ success: boolean; message?: string }>(`${API_BASE}/setup/test-db`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Auth
  auth: {
    register: (data: { email: string; password: string; name?: string }) =>
      fetchJSON<AuthResponse>(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      fetchJSON<AuthResponse>(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () =>
      fetchJSON<{ message: string }>(`${API_BASE}/auth/logout`, { method: 'POST' }),
    me: () => fetchJSON<AuthResponse>(`${API_BASE}/auth/me`),
  },

  // Cars
  cars: {
    list: (params?: CarFilters) => {
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      return fetchJSON<CarsResponse>(`${API_BASE}/cars${query ? `?${query}` : ''}`);
    },
    get: (id: string) => fetchJSON<CarResponse>(`${API_BASE}/cars/${id}`),
    create: (data: CarFormData) =>
      fetchJSON<CarResponse>(`${API_BASE}/cars`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: CarFormData) =>
      fetchJSON<CarResponse>(`${API_BASE}/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchJSON<{ message: string }>(`${API_BASE}/cars/${id}`, { method: 'DELETE' }),
  },

  // Bookings
  bookings: {
    list: (params?: { status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      return fetchJSON<{ bookings: unknown[] }>(`${API_BASE}/bookings${query ? `?${query}` : ''}`);
    },
    stats: () => fetchJSON<Record<string, unknown>>(`${API_BASE}/bookings/stats`),
    get: (id: string) => fetchJSON<unknown>(`${API_BASE}/bookings/${id}`),
    create: (data: Record<string, unknown>) =>
      fetchJSON<{ booking: unknown }>(`${API_BASE}/bookings`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string) =>
      fetchJSON<{ message: string }>(`${API_BASE}/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    updateCharges: (id: string, charges: Record<string, unknown>) =>
      fetchJSON<{ message: string }>(`${API_BASE}/bookings/${id}/charges`, {
        method: 'PATCH',
        body: JSON.stringify(charges),
      }),
    updatePayment: (id: string, payment: { paidAmount: number; paymentNotes?: string }) =>
      fetchJSON<{ message: string }>(`${API_BASE}/bookings/${id}/payment`, {
        method: 'PATCH',
        body: JSON.stringify(payment),
      }),
    delete: (id: string) =>
      fetchJSON<{ message: string }>(`${API_BASE}/bookings/${id}`, { method: 'DELETE' }),
  },

  // Settings
  settings: {
    get: () => fetchJSON<{ settings: Record<string, string> }>(`${API_BASE}/settings`),
    update: (data: Record<string, unknown>) =>
      fetchJSON<{ message: string }>(`${API_BASE}/settings`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getKey: (key: string) =>
      fetchJSON<{ key: string; value: string }>(`${API_BASE}/settings/${key}`),
  },

  // Users
  users: {
    list: (params?: { page?: number; limit?: number }) => {
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      return fetchJSON<{ users: unknown[] }>(`${API_BASE}/users${query ? `?${query}` : ''}`);
    },
    stats: () => fetchJSON<Record<string, unknown>>(`${API_BASE}/users/stats`),
    get: (id: string) => fetchJSON<unknown>(`${API_BASE}/users/${id}`),
    profile: () => fetchJSON<unknown>(`${API_BASE}/users/profile/me`),
    uploadDocuments: async (data: { idCard?: File; driverLicense?: File }) => {
      const formData = new FormData();
      if (data.idCard) formData.append('idCard', data.idCard);
      if (data.driverLicense) formData.append('driverLicense', data.driverLicense);

      const res = await fetch(`${API_BASE}/users/profile/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      return res.json();
    },
    pendingVerification: () => fetchJSON<{ users: unknown[] }>(`${API_BASE}/users/pending-verification`),
    updateVerification: (id: string, status: string, note?: string) =>
      fetchJSON<{ message: string }>(`${API_BASE}/users/${id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }),
    create: (data: Record<string, unknown>) =>
      fetchJSON<{ user: unknown }>(`${API_BASE}/users`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchJSON<{ message: string }>(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchJSON<{ message: string }>(`${API_BASE}/users/${id}`, { method: 'DELETE' }),
  },
};
