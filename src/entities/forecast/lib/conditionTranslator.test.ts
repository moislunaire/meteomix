import { describe, it, expect } from 'vitest';
import { mapConditionToRussian } from './conditionTranslator';

describe('mapConditionToRussian', () => {
  it('returns default for empty input', () => {
    expect(mapConditionToRussian('')).toBe('Неизвестное состояние');
    expect(mapConditionToRussian(undefined)).toBe('Неизвестное состояние');
    expect(mapConditionToRussian(null as unknown as undefined)).toBe('Неизвестное состояние');
  });

  it('passes through Russian text', () => {
    expect(mapConditionToRussian('Ясно')).toBe('Ясно');
  });

  it('maps common conditions', () => {
    expect(mapConditionToRussian('Light rain')).toBe('Дождь');
    expect(mapConditionToRussian('SNOW')).toBe('Снег');
    expect(mapConditionToRussian('Partly cloudy')).toBe('Переменная облачность');
    expect(mapConditionToRussian('Thunderstorm')).toBe('Гроза');
    expect(mapConditionToRussian('Fog')).toBe('Туман');
    expect(mapConditionToRussian('Overcast')).toBe('Облачно');
    expect(mapConditionToRussian('Clear sky')).toBe('Ясно');
  });

  it('returns default for unknown', () => {
    expect(mapConditionToRussian('Unobtanium weather')).toBe('Неизвестное состояние');
  });
});
