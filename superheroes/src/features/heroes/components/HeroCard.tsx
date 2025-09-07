import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@theme';
import { Hero } from '@types/hero';
import Icon from '@components/Icon';

interface HeroCardProps {
  hero: Hero;
  onPress: (hero: Hero) => void;
  onToggleFavorite: (hero: Hero) => void;
  isFavorite: boolean;
}

export default function HeroCard({ hero, onPress, onToggleFavorite, isFavorite }: HeroCardProps) {
  const handlePress = () => onPress(hero);
  const handleFavoritePress = () => onToggleFavorite(hero);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        {/* Columna izquierda - Imagen que ocupa toda la altura */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: hero.images.md }} 
            style={styles.image}
            resizeMode="cover"
          />
          {/* Botón de favorito sobre la imagen */}
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Icon 
              name="favorite" 
              size={16} 
              color={isFavorite ? '#FFFFFF' : theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Columna derecha - Información con fondo */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {hero.name}
          </Text>
          <Text style={styles.alterEgo} numberOfLines={1}>
            {hero.biography.fullName}
          </Text>
          <View style={styles.powerContainer}>
            <Icon name="superhero" size={16} color={theme.colors.primary[300]} />
            <Text style={styles.powerText}>
              {hero.powerstats.strength} / 100
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent', 
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  cardContent: {
    flexDirection: 'row',
    height: 180, 
  },
  imageContainer: {
    width: 160, 
    height: '100%', 
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: '#362C6AA6', 
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  name: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  alterEgo: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  powerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#6A4DBC',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
