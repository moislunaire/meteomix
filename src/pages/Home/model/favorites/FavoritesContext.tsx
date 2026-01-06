import { createContext } from 'react';
import type { CityLocation } from '../cities';

export type FavoriteLocation = CityLocation & {
  id: string;
  createdAt: number;
};

type FavoritesContextType = {
  favorites: FavoriteLocation[];
  addFavorite: (location: CityLocation) => boolean;
  removeFavorite: (id: string) => void;
  error: string | null;
  clearError: () => void;
  maxFavorites: number;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
