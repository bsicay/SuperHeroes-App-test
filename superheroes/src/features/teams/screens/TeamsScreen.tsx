import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '@theme/index';
import Icon from '@components/Icon';
import useTeamsOffline from '../hooks/useTeamsOffline';
import BiometricAuth from '@native-modules/BiometricAuth/BiometricAuth';

export default function TeamsScreen() {
  const { teams, loading, createTeam } = useTeamsOffline();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTeamPress = () => {
    if (!BiometricAuth) {
      Alert.alert('Error', 'Biometric authentication not available');
      return;
    }

    BiometricAuth.authenticate(
      () => {
        // Success - Show modal
        setShowCreateModal(true);
      },
      (error) => {
        // Failure - Show error
        Alert.alert('Autenticación Fallida', error.message);
      }
    );
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el equipo');
      return;
    }

    try {
      setIsCreating(true);
      await createTeam({
        name: teamName.trim(),
        description: '',
        memberIds: [],
        isPublic: false,
      });
      
      setShowCreateModal(false);
      setTeamName('');
      Alert.alert('Éxito', 'Equipo creado exitosamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el equipo');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setTeamName('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando equipos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateTeamPress}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {teams.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Icon name="team" size={80} color={theme.colors.text.tertiary} />
          </View>
          <Text style={styles.emptyText}>Create your first team</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleCreateTeamPress}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.teamsList}>
          {/* TODO: Implementar lista de equipos */}
          <Text style={styles.comingSoon}>Lista de equipos próximamente...</Text>
        </View>
      )}

      {/* Create Team Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add a new team</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Team name:</Text>
                <TextInput
                  style={styles.textInput}
                  value={teamName}
                  onChangeText={setTeamName}
                  placeholder="Thunderbolts"
                  placeholderTextColor={theme.colors.text.tertiary}
                  autoFocus={true}
                />
              </View>

              <TouchableOpacity
                style={[styles.createButton, isCreating && styles.createButtonDisabled]}
                onPress={handleCreateTeam}
                disabled={isCreating}
                activeOpacity={0.7}
              >
                <Text style={styles.createButtonText}>
                  {isCreating ? 'Creating...' : 'Create team'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
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
    paddingHorizontal: theme.spacing[6],
  },
  emptyIcon: {
    marginBottom: theme.spacing[6],
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[8],
  },
  emptyButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyButtonText: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  teamsList: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
  },
  comingSoon: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[8],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.primary[300],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[8],
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing[6],
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing[6],
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: '#FFFFFF',
    marginBottom: theme.spacing[2],
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
  createButton: {
    backgroundColor: theme.colors.primary[300],
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing[8],
    paddingVertical: theme.spacing[4],
    width: '100%',
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#FFFFFF',
  },
});