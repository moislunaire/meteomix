export function mapVisualCrossingIcon(icon: string): string {
  const code = icon.toLowerCase();

  if (code.includes('clear')) return '☀️';
  if (code.includes('cloud')) return '☁️';
  if (code.includes('rain')) return '🌧️';
  if (code.includes('snow')) return '❄️';
  if (code.includes('fog')) return '🌫️';
  if (code.includes('storm') || code.includes('thunder')) return '⛈️';

  return '🌦️';
}
