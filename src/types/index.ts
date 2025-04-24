
export interface Repository {
  name: string;
  fullName: string;
  url: string;
  description: string;
  readme: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  owner: {
    login: string;
    avatarUrl: string;
  };
  topics: string[];
  homepage: string | null;
  license: string | null;
  updatedAt: string;
}

export interface RepoAnalysis {
  projectName: string;
  tagline: string;
  problem: string;
  solution: string;
  techStack: string[];
  keyFeatures: string[];
  usageInstructions: string;
  githubUrl: string;
  demoUrl: string | null;
}

export interface PitchScript {
  intro: string;
  problem: string;
  solution: string;
  features: string;
  tech: string;
  conclusion: string;
  fullScript: string;
}

export interface AnalysisResult {
  repoData: Repository;
  analysis: RepoAnalysis;
  pitchScript: PitchScript;
}
