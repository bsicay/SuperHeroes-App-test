import { useState, useEffect } from 'react';
import { Team } from '@types/team';
import { teamsRepository } from '@services/storage/teamsRepository';

export default function useTeamsOffline() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const localTeams = await teamsRepository.getAllTeams();
      setTeams(localTeams);
      setLoading(false);
      
      console.log(`[useTeamsOffline] Loaded ${localTeams.length} teams from local database`);
    } catch (err) {
      console.error('[useTeamsOffline] Error loading teams:', err);
      setError(err);
      setLoading(false);
    }
  };

  const createTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> => {
    try {
      const newTeam = await teamsRepository.createTeam(teamData);
      setTeams(prevTeams => [...prevTeams, newTeam]);
      return newTeam;
    } catch (err) {
      console.error('[useTeamsOffline] Error creating team:', err);
      throw err;
    }
  };

  const updateTeam = async (teamId: string, teamData: Partial<Team>): Promise<Team> => {
    try {
      const updatedTeam = await teamsRepository.updateTeam(teamId, teamData);
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === teamId ? updatedTeam : team
        )
      );
      return updatedTeam;
    } catch (err) {
      console.error('[useTeamsOffline] Error updating team:', err);
      throw err;
    }
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    try {
      await teamsRepository.deleteTeam(teamId);
      setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    } catch (err) {
      console.error('[useTeamsOffline] Error deleting team:', err);
      throw err;
    }
  };

  const getTeamById = async (teamId: string): Promise<Team | null> => {
    try {
      return await teamsRepository.getTeamById(teamId);
    } catch (err) {
      console.error('[useTeamsOffline] Error getting team by ID:', err);
      return null;
    }
  };

  const searchTeams = async (query: string): Promise<Team[]> => {
    try {
      if (query.trim() === '') {
        return teams;
      }
      
      return await teamsRepository.searchTeams(query);
    } catch (err) {
      console.error('[useTeamsOffline] Error searching teams:', err);
      return teams.filter(team => 
        team.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  };

  return {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    searchTeams,
    refreshTeams: loadTeams,
  };
}
