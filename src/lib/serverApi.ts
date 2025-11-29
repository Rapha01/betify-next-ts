import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Server-side fetch with optional auth from cookies
export async function serverApiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (process.env.NODE_ENV === 'development') 
    await new Promise(resolve => setTimeout(resolve, 1000));

  // Get token from cookies and add auth header if present
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Enable sending/receiving cookies
    // Use cache option if provided, otherwise default to revalidate
    cache: options.cache,
    next: options.next,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const error = new Error(data?.error?.message || data?.message || `Request failed: ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

// Server-side game API
export const serverGameAPI = {
  async getGameBySlug(slug: string) {
    // For SEO/metadata generation, use revalidate for better performance
    return serverApiFetch(`/game/slug/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
  },
};

// Server-side bet API
export const serverBetAPI = {
  async getBetBySlug(slug: string) {
    // Use the optimized endpoint that gets bet directly by slug
    return serverApiFetch(`/bet/slug/${slug}`, {
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    });
  },
};