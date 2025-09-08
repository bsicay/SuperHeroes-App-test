import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@theme/index';

// Import SVG icons
import SuperheroIcon from '@assets/icons/superhero.svg';
import TeamIcon from '@assets/icons/team.svg';
import FavoriteIcon from '@assets/icons/favorite.svg';
import ArrowLeftIcon from '@assets/icons/arrow-left.svg';
import CloseIcon from '@assets/icons/close.svg';
import SearchIcon from '@assets/icons/search.svg';

interface IconProps {
  name: 'superhero' | 'team' | 'favorite' | 'search' | 'back' | 'arrow-left' | 'close';
  size?: number;
  color?: string;
  active?: boolean;
  showBackground?: boolean; // Nueva prop para mostrar fondo
}

export default function Icon({ name, size = 24, color, active = false, showBackground = false }: IconProps) {
  // Colores para el icono
  const iconColor = active ? '#8067FF' : (color || '#FFFFFF');
  const strokeColor = active ? '#8067FF' : theme.colors.primary[500];
  
  const backgroundColor = showBackground && !active ? 'transparent' : 'transparent';
  
  const renderIcon = () => {
    switch (name) {
      case 'superhero':
        return <SuperheroIcon width={size} height={size} fill={iconColor} stroke={strokeColor} />;
      case 'team':
        return <TeamIcon width={size} height={size} fill={iconColor} stroke={strokeColor} />;
      case 'favorite':
        return <FavoriteIcon width={size} height={size} fill={iconColor} stroke={strokeColor} />;
      case 'search':
        return <SearchIcon width={size} height={size} fill={'transparent'} stroke={'#FFFFFF'} />; 
      case 'back':
        return <ArrowLeftIcon width={size} height={size} stroke={iconColor} />; 
      case 'arrow-left':
        return <ArrowLeftIcon width={size} height={size} stroke={iconColor} />;
      case 'close':
        return <CloseIcon width={size} height={size} stroke={iconColor} />;
      default:
        return null;
    }
  };

  // Si no necesita fondo, renderizar solo el icono
  if (!showBackground) {
    return renderIcon();
  }

  return (
    <View style={[
      styles.iconContainer,
      {
        backgroundColor,
        width: size + 16, // Agregar padding
        height: size + 16,
        borderRadius: (size + 16) / 2,
      }
    ]}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
