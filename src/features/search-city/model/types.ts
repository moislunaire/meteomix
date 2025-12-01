export interface SuggestItem {
  title: { text: string };
  subtitle?: { text: string };
  distance: {
    text: string;
    value: number;
  };
}

export interface SuggestOption {
  label: string;
  value: string;
}

export interface CityResult {
  name: string;
  fullName: string;
  lat: number;
  lon: number;
}
