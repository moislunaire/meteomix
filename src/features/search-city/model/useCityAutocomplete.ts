import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';

import { fetchSuggest } from '../api/suggestApi';
import { fetchCoordinates } from '../api/geocoderApi';
import { formatSuggestLabel } from './mappers';
import type { CityResult, SuggestItem, SuggestOption } from './types';

export function useCityAutocomplete(onSelect: (city: CityResult) => void, initialLabel = '') {
  const defaultOption = useMemo(() => {
    if (!initialLabel) return [] as SuggestOption[];
    return [
      {
        value: initialLabel,
        label: initialLabel,
      },
    ];
  }, [initialLabel]);

  const [input, setInput] = useState(initialLabel);
  const [value, setValue] = useState<string | null>(initialLabel || null);
  const [debounced] = useDebouncedValue(input, 350);

  const [suggestions, setSuggestions] = useState<SuggestOption[]>(defaultOption);
  const [rawItems, setRawItems] = useState<SuggestItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Позволяет обновить выбранный город, если он задан извне (например, дефолтный город)
  useEffect(() => {
    if (!initialLabel) return;

    setInput(initialLabel);
    setValue(initialLabel);
    setSuggestions((prev) => {
      const hasInitial = prev.some((option) => option.value === initialLabel);
      if (hasInitial) return prev;
      return [
        {
          value: initialLabel,
          label: initialLabel,
        },
        ...prev,
      ];
    });
  }, [initialLabel]);

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
    async (value: string) => {
      setValue(value);

      const option = suggestions.find((suggestion) => suggestion.value === value);
      const item = rawItems.find((i) => formatSuggestLabel(i).value === value);

      const label = option?.label ?? value;
      setInput(label);

      const name = item?.title.text ?? label;

      const coords = await fetchCoordinates(name);

      onSelect({
        name,
        fullName: label,
        lat: coords.lat,
        lon: coords.lon,
      });
    },
    [rawItems, suggestions, onSelect]
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
