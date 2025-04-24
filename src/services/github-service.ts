
import { Repository } from "@/types";

export class GitHubService {
  static async fetchRepository(url: string): Promise<Repository> {
    try {
      // Extract owner and repo name from GitHub URL
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(regex);
      
      if (!match) {
        throw new Error("Invalid GitHub repository URL");
      }
      
      const [_, owner, repo] = match;
      
      // Fetch repository information
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!repoResponse.ok) {
        throw new Error(`Failed to fetch repository: ${repoResponse.statusText}`);
      }
      
      const repoData = await repoResponse.json();
      
      // Fetch README content
      const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
      let readme = "";
      
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        // README content is base64 encoded
        const base64Content = readmeData.content;
        readme = atob(base64Content.replace(/\n/g, ""));
      }
      
      return {
        name: repoData.name,
        fullName: repoData.full_name,
        url: repoData.html_url,
        description: repoData.description || "",
        readme: readme,
        language: repoData.language || "",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        owner: {
          login: repoData.owner.login,
          avatarUrl: repoData.owner.avatar_url
        },
        topics: repoData.topics || [],
        homepage: repoData.homepage,
        license: repoData.license ? repoData.license.name : null,
        updatedAt: repoData.updated_at
      };
    } catch (error) {
      console.error("Error fetching repository:", error);
      throw error;
    }
  }
  
  static validateGitHubUrl(url: string): boolean {
    const regex = /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?$/;
    return regex.test(url);
  }
}
