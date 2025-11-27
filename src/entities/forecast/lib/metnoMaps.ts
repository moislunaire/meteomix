export function mapMetNoSymbol(code: string): string {
  if (code.includes('clearsky')) return 'Clear';
  if (code.includes('cloudy')) return 'Cloudy';
  if (code.includes('fair')) return 'Partly cloudy';
  if (code.includes('rain')) return 'Rain';
  if (code.includes('snow')) return 'Snow';
  if (code.includes('fog')) return 'Fog';
  if (code.includes('sleet')) return 'Sleet';
  if (code.includes('thunder')) return 'Thunderstorm';
  return 'Unknown';
}

export function mapMetNoIcon(code: string): string {
  if (code.includes('clearsky')) return '☀️';
  if (code.includes('cloudy')) return '☁️';
  if (code.includes('fair')) return '⛅';
  if (code.includes('rain')) return '🌧️';
  if (code.includes('snow')) return '❄️';
  if (code.includes('fog')) return '🌫️';
  if (code.includes('sleet')) return '🌨️';
  if (code.includes('thunder')) return '⛈️';
  return '❓';
}
