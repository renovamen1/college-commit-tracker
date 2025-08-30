export interface User {
  id: string;
  githubUsername: string;
  name?: string;
  email?: string;
  role: 'admin' | 'student';
  classId?: string;
  totalCommits: number;
  lastSyncDate?: Date;
  createdAt: Date;
}

export interface Class {
  id: string;
  name: string;
  department: string;
  studentCount: number;
  totalCommits: number;
  createdAt: Date;
}

export interface CommitData {
  id: string;
  userId: string;
  repositoryName: string;
  commitCount: number;
  lastCommitDate: Date;
  syncDate: Date;
}

export interface Repository {
  name: string;
  description?: string;
  language?: string;
  updated_at: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
  };
  date: Date;
}
