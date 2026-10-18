export interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface TechnicalSheet {
  direction: string;
  screenplay: string;
  novel?: string;
  production: string;
  genre: string;
  countryLanguage: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  duration: string;
  durationMinutes: number;
  rating: number;
  ratingCount?: string;
  genres: string[];
  director: string;
  producer: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  badges: string[];
  isFeatured?: boolean;
  cast: CastMember[];
  technicalSheet: TechnicalSheet;
}
