import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@theme/index';

// Import SVG icons
import SuperheroIcon from '@assets/icons/superhero.svg';
import TeamIcon from '@assets/icons/team.svg';
import FavoriteIcon from '@assets/icons/favorite.svg';

interface IconProps {
  name: 'superhero' | 'team' | 'favorite' | 'search' | 'back';
  size?: number;
  color?: string;
  active?: boolean;
}

export default function Icon({ name, size = 24, color, active = false }: IconProps) {
  const iconColor = color || (active ? theme.colors.primary[300] : theme.colors.text.tertiary);
  
  const renderIcon = () => {
    switch (name) {
      case 'superhero':
        return <SuperheroIcon width={size} height={size} fill={iconColor} />;
      case 'team':
        return <TeamIcon width={size} height={size} fill={iconColor} />;
      case 'favorite':
        return <FavoriteIcon width={size} height={size} fill={iconColor} />;
      case 'search':
        return <SuperheroIcon width={size} height={size} fill={iconColor} />; // Usar superhero como search temporalmente
      case 'back':
        return <SuperheroIcon width={size} height={size} fill={iconColor} />; // Usar superhero como back temporalmente
      default:
        return null;
    }
  };

  return renderIcon();
}

const styles = StyleSheet.create({
  // Styles removed since we're using SVG icons directly
});
