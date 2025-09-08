import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@theme';
import Icon from '@components/Icon';
import useGetHero from '../hooks/useGetHero';
import { useFavorites } from '@features/favorites/context/FavoritesContext';
import { addPowerScoreToHero } from '@utils/powerScore';

const { width, height } = Dimensions.get('window');

export default function HeroDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { heroId } = route.params as { heroId: number };
  
  const { hero, loading, error } = useGetHero(heroId);
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavoritePress = async () => {
    if (!hero) return;

    try {
      const newFavoriteStatus = await toggleFavorite(hero);
      const message = newFavoriteStatus 
        ? `${hero.name} agregado a favoritos` 
        : `${hero.name} removido de favoritos`;
      Alert.alert('Favorito', message);
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el favorito');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error || !hero) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar el héroe</Text>
        <Text style={styles.errorDetails}>
          {error?.message || 'Héroe no encontrado'}
        </Text>
      </View>
    );
  }

  const heroWithScore = addPowerScoreToHero(hero);
  const powerStats = heroWithScore.powerstats;

  const stats = [
    { label: 'Intelligence', value: powerStats.intelligence },
    { label: 'Strength', value: powerStats.strength },
    { label: 'Speed', value: powerStats.speed },
    { label: 'Durability', value: powerStats.durability },
    { label: 'Power', value: powerStats.power },
    { label: 'Combat', value: powerStats.combat },
  ];

  return (
    <View style={styles.container}>
      {/* Header con botones */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Icon name="back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.headerButton,
            { backgroundColor: isFavorite(hero.id) ? '#6A4DBC' : '#6A4DBC' }
          ]}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
        >
          <Icon 
            name="favorite" 
            size={20} 
            color={isFavorite(hero.id) ? '#FFFFFF' : 'transparent'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del héroe */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: hero.images.lg }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Card de información */}
        <View style={styles.infoCard}>
          {/* Nombre del héroe */}
          <Text style={styles.heroName}>{hero.name}</Text>
          
          {/* Información básica */}
          <Text style={styles.realName}>
            Real Name: <Text style={styles.boldText}>{hero.biography.fullName}</Text>
          </Text>
          <Text style={styles.alterEgos}>
            Alter egos: <Text style={styles.boldText}>{hero.biography.alterEgos}</Text>
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={stat.label}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
                {index < stats.length - 1 && <View style={styles.statDivider} />}
              </View>
            ))}
          </View>

          {/* Average Score */}
          <View style={styles.avgScoreContainer}>
            <View style={styles.avgScoreRow}>
              <Icon name="superhero" size={16} color="#FFD700" />
              <Text style={styles.avgScoreLabel}>Avg. Score: </Text>
              <Text style={styles.avgScoreValue}>{heroWithScore.powerScore}</Text>
              <Text style={styles.avgScoreMax}> / 100</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  header: {
    position: 'absolute',
    top: 60, // Ajustado para el status bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A4DBC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    height: height * 0.6,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: '#362C6A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    marginTop: -20,
    minHeight: height * 0.5, // Altura mínima para asegurar que se vea bien
  },
  heroName: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  realName: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alterEgos: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 40, // Agregar espacio a la derecha
  },
  statLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: '#FFFFFF',
    minWidth: 120, // Ancho mínimo para alineación
    marginRight: 20, // Espacio entre label y value
  },
  statValue: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  boldText: {
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  statDivider: {
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  avgScoreContainer: {
    marginTop: 10,
  },
  avgScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avgScoreLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  avgScoreValue: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  avgScoreMax: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});