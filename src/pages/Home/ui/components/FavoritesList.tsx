import { Flex } from '@mantine/core';
import { FavoriteLocationCard } from './FavoriteLocationCard';
import { useFavorites } from '../../model/favorites';
import classes from './FavoritesList.module.css';

export function FavoritesList() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <Flex gap="sm" wrap="nowrap" className={classes.container}>
      {favorites.map((location) => (
        <FavoriteLocationCard key={location.id} location={location} onRemove={removeFavorite} />
      ))}
    </Flex>
  );
}
