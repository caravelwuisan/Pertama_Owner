export type Role = 'admin' | 'owner';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  completionPercentage: number;
  nextMilestone: string;
  address: string;
}

export interface Camera {
  id: string;
  projectId: string;
  name: string;
  streamUrl: string;
  status: 'online' | 'offline';
}

export interface Invoice {
  id: string;
  projectId: string;
  month: string;
  year: number;
  amount: number;
  status: 'Paid' | 'Pending';
  description: string;
  date: string;
}

export interface TimelineMilestone {
  id: string;
  projectId: string;
  title: string;
  date: string;
  description: string;
  completionPercentage: number;
  photos: string[];
  status: 'completed' | 'in-progress' | 'pending';
}

export interface DailyUpdate {
  id: string;
  projectId: string;
  date: string;
  text: string;
  author: string;
  photos: string[];
}
