import { useState, useEffect, useCallback } from 'react';
import { useDebouncedValue } from '@mantine/hooks';

import { fetchSuggest } from '../api/suggestApi';
import { fetchCoordinates } from '../api/geocoderApi';
import { formatSuggestLabel } from './mappers';
import type { CityResult, SuggestItem } from './types';

export function useCityAutocomplete(onSelect: (city: CityResult) => void) {
  const [input, setInput] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const [debounced] = useDebouncedValue(input, 350);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [rawItems, setRawItems] = useState<SuggestItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounced.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const data = await fetchSuggest(debounced);
        if (cancelled) return;

        setRawItems(data);
        setSuggestions(data.map(formatSuggestLabel));
      } catch (e) {
        console.error('Suggest error:', e);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  // Выбор города
  const selectCity = useCallback(
    async (label: string) => {
      console.log('🚀 ~ useCityAutocomplete ~ label:', label);
      setValue(label);
      setInput(label);

      const item = rawItems.find((i) => formatSuggestLabel(i) === label);
      const name = item?.title.text ?? label;

      const coords = await fetchCoordinates(name);

      onSelect({
        name,
        fullName: label,
        lat: coords.lat,
        lon: coords.lon,
      });
    },
    [rawItems, onSelect]
  );

  return {
    input,
    setInput,
    suggestions,
    loading,
    selectCity,
    value,
    setValue,
  };
}
