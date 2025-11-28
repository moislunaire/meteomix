export const env = {
  yandexSuggestKey: import.meta.env.PROD
    ? import.meta.env.VITE_YANDEX_SUGGEST_KEY_PROD
    : import.meta.env.VITE_YANDEX_SUGGEST_KEY_DEV,

  yandexGeocoderKey: import.meta.env.PROD
    ? import.meta.env.VITE_YANDEX_GEOCODER_KEY_PROD
    : import.meta.env.VITE_YANDEX_GEOCODER_KEY_DEV,
};
