export function mapMetNoSymbol(code: string): string {
  if (code.includes('clearsky')) return 'Ясно';
  if (code.includes('cloudy')) return 'Облачно';
  if (code.includes('fair')) return 'Переменная облачность';
  if (code.includes('rain')) return 'Дождь';
  if (code.includes('snow')) return 'Снег';
  if (code.includes('fog')) return 'Туман';
  if (code.includes('sleet')) return 'Мокрый снег';
  if (code.includes('thunder')) return 'Гроза';
  return 'Неизвестное состояние';
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
