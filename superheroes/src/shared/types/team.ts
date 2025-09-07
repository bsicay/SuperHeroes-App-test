export interface Team {
  id: string;
  name: string;
  description?: string;
  memberIds: number[]; // Array of hero IDs
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamWithMembers extends Team {
  members: any[]; // Array of Hero objects
}