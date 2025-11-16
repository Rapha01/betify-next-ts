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
    await new Promise(resolve => setTimeout(resolve, 1000));
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

  async login(email: string, password: string) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

// Account API
export const accountAPI = {
  async getAccountById(id: string) {
    return apiFetch(`/account/${id}`);
  },

  async createAccount(username: string, email: string, password: string, role?: string) {
    return apiFetch('/account', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
  },

  async updateAccount(id: string, field: string, value: any) {
    return apiFetch(`/account/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ field, value }),
    });
  }
};

// Game API
export const gameAPI = {
  async getGamesByAccountId(accountId: string, page: number = 1, limit: number = 9) {
    return apiFetch(`/game/account/${accountId}?page=${page}&limit=${limit}`);
  },

  async getGameById(id: string) {
    return apiFetch(`/game/${id}`);
  },

  async createGame(title: string, genre: string, releaseDate: string) {
    return apiFetch('/game', {
      method: 'POST',
      body: JSON.stringify({ title, genre, releaseDate }),
    });
  },

  async updateGame(id: string, field: string, value: any) {
    return apiFetch(`/game/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ field, value }),
    });
  },

  async getFavoriteGamesByAccountId(accountId: string, page: number = 1, limit: number = 9) {
    return apiFetch(`/game/favorites/${accountId}?page=${page}&limit=${limit}`);
  },
};

// Member API
export const memberAPI = {
  async getMembersByGameId(gameId: string) {
    return apiFetch(`/member/game/${gameId}`);
  },

  async getMemberByGameAndAccountId(gameId: string, accountId: string) {
    return apiFetch(`/member/game/${gameId}/account/${accountId}`);
  },

  async updateMember(gameId: string, accountId: string, field: string, value: any) {
    return apiFetch(`/member/account/${accountId}/game/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify({ [field]: value }),
    });
  },
};

// Utility functions
export { getToken, setToken };