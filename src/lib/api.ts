const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Token management
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

// Base fetch function with auth
async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Add artificial delay in development for testing loading animations
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error?.message || data?.message || `Request failed: ${response.status}`);
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data;
}

// Auth API
export const authAPI = {
  async register(username: string, email: string, password: string) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    return data;
  },

  async login(username: string, password: string) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  async logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      setToken(null);
    }
  },

  async getCurrentUser() {
    return apiFetch('/auth/me');
  },
};

// User API
export const userAPI = {
  async getUsers() {
    return apiFetch('/users');
  },

  async getUserById(id: string) {
    return apiFetch(`/users/${id}`);
  },

  async createUser(username: string, email: string, password: string, role?: string) {
    return apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
  },

  async updateUser(id: string, field: string, value: any) {
    return apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ field, value }),
    });
  },

  async deleteUser(id: string) {
    return apiFetch(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Game API
export const gameAPI = {
  async getGames() {
    return apiFetch('/games');
  },

  async getGameById(id: string) {
    return apiFetch(`/games/${id}`);
  },

  async createGame(name: string, genre: string, releaseDate: string) {
    return apiFetch('/games', {
      method: 'POST',
      body: JSON.stringify({ name, genre, releaseDate }),
    });
  },

  async updateGame(id: string, field: string, value: any) {
    return apiFetch(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ field, value }),
    });
  },

  async deleteGame(id: string) {
    return apiFetch(`/games/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions
export { getToken, setToken };