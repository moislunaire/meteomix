const CONDITION_MAP: { keywords: string[]; value: string }[] = [
  { keywords: ['thunder', 'storm', 'lightning'], value: 'Гроза' },
  { keywords: ['sleet'], value: 'Мокрый снег' },
  { keywords: ['snow', 'blizzard', 'flurries'], value: 'Снег' },
  { keywords: ['drizzle', 'rain', 'shower'], value: 'Дождь' },
  { keywords: ['fog', 'mist', 'haze'], value: 'Туман' },
  {
    keywords: ['partly sunny', 'partly cloudy', 'mostly sunny', 'fair'],
    value: 'Переменная облачность',
  },
  { keywords: ['overcast', 'cloud'], value: 'Облачно' },
  { keywords: ['clear', 'sunny', 'bright'], value: 'Ясно' },
];

export function mapConditionToRussian(condition: string | null | undefined): string {
  const text = condition?.trim();
  if (!text) return 'Неизвестное состояние';

  if (/[а-яё]/i.test(text)) return text;

  const lower = text.toLowerCase();

  for (const { keywords, value } of CONDITION_MAP) {
    if (keywords.some((keyword) => lower.includes(keyword))) return value;
  }

  return 'Неизвестное состояние';
}
