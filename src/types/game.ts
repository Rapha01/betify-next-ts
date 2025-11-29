export interface Game {
  id: string;
  account_id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string;
  language: string;
  currency_name: string;
  start_currency: number;
  is_public: boolean;
  bet_count: number;
  member_count: number;
  is_active: boolean;
  created_at: number;
}

export interface Member {
  id: string;
  game_id: string;
  account_id: string;
  is_moderator: boolean;
  is_banned: boolean;
  is_favorited: boolean;
  currency: number;
  created_at: number;
}

export interface CreateGameDto {
  title: string;
  account_id: string;
}

export interface UpdateGameDto {
  title?: string;
  slug?: string;
  description?: string;
  banner_url?: string;
  currency_name?: string;
  language?: string;
  is_active?: boolean;
  is_public?: boolean;
  start_currency?: number;
}
