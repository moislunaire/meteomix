import type { SuggestItem } from './types';

export const formatSuggestLabel = (item: SuggestItem) => {
  const title = item.title.text;
  const sub = item.subtitle?.text ?? '';
  const distance = item.distance.text;
  return sub ? `${title}, ${sub}, ${distance}` : `${title} ${distance}`;
};
