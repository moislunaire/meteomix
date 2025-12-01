import type { SuggestItem, SuggestOption } from './types';

export const formatSuggestLabel = (item: SuggestItem): SuggestOption => {
  const title = item.title.text;
  const subtitle = item.subtitle?.text;
  const distance = item.distance.text;

  const label = subtitle ? `${title}, ${subtitle}` : title;

  return {
    label,
    value: `${label} — ${distance}`,
  };
};
