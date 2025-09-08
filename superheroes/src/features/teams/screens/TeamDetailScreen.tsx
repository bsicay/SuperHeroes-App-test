import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '@theme/index';
import Icon from '@components/Icon';
import useTeamsOffline from '../hooks/useTeamsOffline';
import { heroesRepository } from '@services/storage/heroesRepository';
import { Hero } from '@types/hero';
import HeroCard from '@features/heroes/components/HeroCard';

export default function TeamDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { teamId } = route.params as { teamId: string };
  
  const { getTeamById, updateTeam } = useTeamsOffline();
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [teamId]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const teamData = await getTeamById(teamId);
      if (teamData) {
        setTeam(teamData);
        
        // Load member details
        if (teamData.memberIds.length > 0) {
          const memberPromises = teamData.memberIds.map((id: number) => 
            heroesRepository.getHeroById(id)
          );
          const memberResults = await Promise.all(memberPromises);
          const validMembers = memberResults.filter(member => member !== null) as Hero[];
          setMembers(validMembers);
        }
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberPress = () => {
    navigation.navigate('AddMember', { teamId });
  };

  const handleRemoveMember = async (heroId: number) => {
    if (!team) return;

    try {
      const updatedMemberIds = team.memberIds.filter((id: number) => id !== heroId);
      await updateTeam(teamId, { memberIds: updatedMemberIds });
      
      // Update local state
      setTeam({ ...team, memberIds: updatedMemberIds });
      setMembers(members.filter(member => member.id !== heroId));
      
      Alert.alert('Éxito', 'Miembro removido del equipo');
    } catch (error) {
      Alert.alert('Error', 'No se pudo remover el miembro');
    }
  };

  const handleHeroPress = (hero: Hero) => {
    navigation.navigate('HeroDetail', { heroId: hero.id });
  };

  const handleToggleFavorite = async (hero: Hero) => {
    try {
      const newFavoriteStatus = await heroesRepository.toggleFavorite(hero.id);
      
      // Update local state
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === hero.id 
            ? { ...member, isFavorite: newFavoriteStatus }
            : member
        )
      );
      
      const message = newFavoriteStatus 
        ? `${hero.name} agregado a favoritos` 
        : `${hero.name} removido de favoritos`;
      Alert.alert('Favorito', message);
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el favorito');
    }
  };

  const renderMemberItem = ({ item }: { item: Hero }) => (
    <HeroCard
      hero={item}
      onPress={handleHeroPress}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={item.isFavorite || false}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando equipo...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Equipo no encontrado</Text>
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
        
        <Text style={styles.teamTitle}>{team.name}</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMemberPress}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {members.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No team members</Text>
        </View>
      ) : (
        <View style={styles.membersList}>
          <FlatList
            data={members}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.membersListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  errorText: {
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
  teamTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing[4],
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  membersList: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
  },
  membersListContent: {
    paddingTop: theme.spacing[4],
  },
});
