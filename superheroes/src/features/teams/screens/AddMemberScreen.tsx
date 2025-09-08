import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '@theme/index';
import Icon from '@components/Icon';
import SearchBar from '@components/SearchBar';
import useTeamsOffline from '../hooks/useTeamsOffline';
import { heroesRepository } from '@services/storage/heroesRepository';
import { Hero } from '@types/hero';
import { addPowerScoreToHero } from '@utils/powerScore';

export default function AddMemberScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { teamId } = route.params as { teamId: string };
  
  const { getTeamById, updateTeam } = useTeamsOffline();
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const heroes = await heroesRepository.getAllHeroes();
      setAllHeroes(heroes);
    } catch (error) {
      console.error('Error loading heroes:', error);
      Alert.alert('Error', 'No se pudieron cargar los héroes');
    } finally {
      setLoading(false);
    }
  };

  const filteredHeroes = useMemo(() => {
    if (!searchQuery.trim()) return allHeroes;
    
    return allHeroes.filter(hero =>
      hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.biography.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allHeroes, searchQuery]);

  const handleAddMember = async (hero: Hero) => {
    try {
      const team = await getTeamById(teamId);
      if (!team) {
        Alert.alert('Error', 'Equipo no encontrado');
        return;
      }

      if (team.memberIds.includes(hero.id)) {
        Alert.alert('Error', 'Este héroe ya está en el equipo');
        return;
      }

      const updatedMemberIds = [...team.memberIds, hero.id];
      await updateTeam(teamId, { memberIds: updatedMemberIds });
      
      Alert.alert('Éxito', `${hero.name} agregado al equipo`);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert('Error', 'No se pudo agregar el miembro');
    }
  };

  const renderHeroItem = ({ item }: { item: Hero }) => {
    const heroWithScore = addPowerScoreToHero(item);
    
    return (
      <View style={styles.heroItem}>
        <Image
          source={{ uri: item.images.sm }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>{item.name}</Text>
          <Text style={styles.heroDetails}>
            {item.biography.fullName || item.biography.alterEgos || 'Unknown'}
          </Text>
          <View style={styles.powerContainer}>
            <Icon name="superhero" size={16} color="#FFD700" />
            <Text style={styles.powerText}>
              {heroWithScore.powerScore} / 100
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddMember(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando héroes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Add member</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
      />

      {/* Heroes List */}
      <View style={styles.heroesList}>
        <FlatList
          data={filteredHeroes}
          renderItem={renderHeroItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.heroesListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  heroesList: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
  },
  heroesListContent: {
    paddingTop: theme.spacing[4],
  },
  heroItem: {
    backgroundColor: '#362C6AA6',
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroImage: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.md,
    marginRight: theme.spacing[4],
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  heroDetails: {
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
});
