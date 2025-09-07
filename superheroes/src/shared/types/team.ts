import { Hero } from './hero';

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: Hero[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  memberIds: number[];
  isPublic?: boolean;
}

export interface UpdateTeamRequest {
  id: string;
  name?: string;
  description?: string;
  memberIds?: number[];
  isPublic?: boolean;
}

export interface TeamStats {
  totalPower: number;
  averagePower: number;
  memberCount: number;
  alignment: {
    good: number;
    bad: number;
    neutral: number;
  };
}
