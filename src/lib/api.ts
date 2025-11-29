import { normalizeBet, normalizeBets } from './bet-utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Base fetch function with auth
async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  // Add artificial delay in development for testing loading animations
  if (process.env.NODE_ENV === 'development') 
    await new Promise(resolve => setTimeout(resolve, 1000));

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Enable sending/receiving cookies
  });

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
    // Cookie is set automatically by backend
    return data;
  },

  async logout() {
    await apiFetch('/auth/logout', { method: 'POST' });
  },

  async getCurrentAccount() {
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

  async updateAccount(id: string, updates: Record<string, any>) {
    return apiFetch(`/account/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
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

  async getGameBySlug(slug: string) {
    return apiFetch(`/game/slug/${slug}`);
  },

  async createGame(title: string, genre: string, releaseDate: string) {
    return apiFetch('/game', {
      method: 'POST',
      body: JSON.stringify({ title, genre, releaseDate }),
    });
  },

  async updateGame(id: string, updates: Record<string, any>) {
    return apiFetch(`/game/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
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

// Bet API
export const betAPI = {
  async getBetsByGameId(gameId: string) {
    const data = await apiFetch(`/bet/game/${gameId}`);
    return normalizeBets(data.bets);
  },

  async getBetById(betId: string) {
    const bet = await apiFetch(`/bet/${betId}`);
    return normalizeBet(bet);
  },

  async getBetBySlug(betSlug: string) {
    const bet = await apiFetch(`/bet/slug/${betSlug}`);
    return normalizeBet(bet);
  },

  async createBet(gameId: string, betData: any) {
    const bet = await apiFetch(`/bet/game/${gameId}`, {
      method: 'POST',
      body: JSON.stringify(betData),
    });
    return normalizeBet(bet);
  },

  async updateBet(betId: string, updates: Record<string, any>) {
    return apiFetch(`/bet/${betId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteBet(betId: string) {
    return apiFetch(`/bet/${betId}`, {
      method: 'DELETE',
    });
  },
};