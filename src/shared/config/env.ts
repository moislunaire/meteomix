type EnvKey =
  | 'VITE_YANDEX_SUGGEST_KEY_PROD'
  | 'VITE_YANDEX_SUGGEST_KEY_DEV'
  | 'VITE_YANDEX_GEOCODER_KEY_PROD'
  | 'VITE_YANDEX_GEOCODER_KEY_DEV';

const envVars = import.meta.env as Record<string, unknown>;

const getEnvValue = (key: EnvKey): string => {
  const value = envVars[key];

  if (typeof value !== 'string' || !value) {
    throw new Error(`Отсутствует обязательная переменная окружения ${key}`);
  }

  return value;
};

export const env = {
  yandexSuggestKey: import.meta.env.PROD
    ? getEnvValue('VITE_YANDEX_SUGGEST_KEY_PROD')
    : getEnvValue('VITE_YANDEX_SUGGEST_KEY_DEV'),
  yandexGeocoderKey: import.meta.env.PROD
    ? getEnvValue('VITE_YANDEX_GEOCODER_KEY_PROD')
    : getEnvValue('VITE_YANDEX_GEOCODER_KEY_DEV'),
};
