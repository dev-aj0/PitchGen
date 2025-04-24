import { Repository, RepoAnalysis, PitchScript, AnalysisResult } from "@/types";

interface AnalyzeOptions {
  pitchDuration: number;
  presentersCount: number;
}

export class AIService {
  private static apiKey: string | null = null;
  
  static setApiKey(key: string) {
    this.apiKey = key;
  }
  
  static async analyzeRepository(repo: Repository, options: AnalyzeOptions): Promise<AnalysisResult> {
    try {
      if (!this.apiKey) {
        throw new Error("OpenAI API key not set");
      }
      
      const analysis = await this.generateAnalysis(repo);
      const pitchScript = await this.generatePitchScript(repo, analysis, options);
      
      return {
        repoData: repo,
        analysis,
        pitchScript
      };
    } catch (error) {
      console.error("Error analyzing repository:", error);
      throw error;
    }
  }
  
  private static async generateAnalysis(repo: Repository): Promise<RepoAnalysis> {
    try {
      const prompt = this.createAnalysisPrompt(repo);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert developer and technical writer tasked with analyzing GitHub repositories and creating clear, concise project summaries."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      const analysisText = result.choices[0].message.content;
      
      return this.parseAnalysisResponse(analysisText);
    } catch (error) {
      console.error("Error generating analysis:", error);
      throw error;
    }
  }
  
  private static async generatePitchScript(repo: Repository, analysis: RepoAnalysis, options: AnalyzeOptions): Promise<PitchScript> {
    try {
      const prompt = this.createPitchPrompt(repo, analysis, options);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert technical communicator who creates compelling pitch scripts for software projects."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      const pitchText = result.choices[0].message.content;
      
      return this.parsePitchResponse(pitchText);
    } catch (error) {
      console.error("Error generating pitch script:", error);
      throw error;
    }
  }
  
  private static createAnalysisPrompt(repo: Repository): string {
    return `
Please analyze this GitHub repository and extract key information for a one-page project summary.
      
Repository Information:
- Name: ${repo.name}
- Description: ${repo.description}
- Language: ${repo.language}
- Topics: ${repo.topics.join(", ")}
      
README Content:
${repo.readme.slice(0, 10000)} ${repo.readme.length > 10000 ? "... (truncated)" : ""}
      
Based on this information, provide the following details in JSON format:
{
  "projectName": "A clean, professional project name",
  "tagline": "A concise tagline (max 15 words)",
  "problem": "Problem the project solves (2-3 sentences)",
  "solution": "How the project solves the problem (2-3 sentences)",
  "techStack": ["List", "of", "technologies", "used"],
  "keyFeatures": ["3-5", "key", "features", "as", "bullet", "points"],
  "usageInstructions": "Brief usage instructions (2-3 sentences)",
  "githubUrl": "${repo.url}",
  "demoUrl": "Demo URL if available, otherwise null"
}
      
If any information is not available, make reasonable inferences based on the repository contents. Keep responses concise and professional.`;
  }
  
  private static createPitchPrompt(repo: Repository, analysis: RepoAnalysis, options: AnalyzeOptions): string {
    return `
Please create a ${options.pitchDuration}-second pitch script for this software project, designed to be presented by ${options.presentersCount} presenter(s). The pitch should be conversational, compelling, and concise.

Project Information:
- Name: ${analysis.projectName}
- Tagline: ${analysis.tagline}
- Problem: ${analysis.problem}
- Solution: ${analysis.solution}
- Tech Stack: ${analysis.techStack.join(", ")}
- Key Features: ${analysis.keyFeatures.join(", ")}

Structure the pitch with these sections:
1. Intro (Project name and tagline)
2. Problem statement
3. Solution description
4. Key features (briefly)
5. Tech stack (briefly)
6. Conclusion/call to action

Provide the script in JSON format:
{
  "intro": "Introduction text",
  "problem": "Problem statement",
  "solution": "Solution description",
  "features": "Key features description",
  "tech": "Tech stack mention",
  "conclusion": "Conclusion and call to action",
  "fullScript": "Complete script combining all sections"
}

Keep the sections balanced and appropriate for ${options.presentersCount} presenter(s) to deliver in ${options.pitchDuration} seconds when spoken. Use a confident, enthusiastic tone that would engage potential users or investors.`;
  }
  
  private static parseAnalysisResponse(text: string): RepoAnalysis {
    try {
      // Find JSON content in the response
      const jsonMatch = text.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from analysis response");
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing analysis response:", error);
      throw new Error("Failed to parse analysis response");
    }
  }
  
  private static parsePitchResponse(text: string): PitchScript {
    try {
      // Find JSON content in the response
      const jsonMatch = text.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from pitch response");
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing pitch response:", error);
      throw new Error("Failed to parse pitch response");
    }
  }
}
