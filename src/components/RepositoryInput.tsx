
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubService } from "@/services/github-service";
import { toast } from "@/components/ui/sonner";

interface RepositoryInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const RepositoryInput = ({ onAnalyze, isLoading }: RepositoryInputProps) => {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("openai_api_key") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate GitHub URL
    if (!GitHubService.validateGitHubUrl(url)) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }
    
    // Validate API key
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key");
      return;
    }
    
    // Save API key to localStorage
    localStorage.setItem("openai_api_key", apiKey);
    
    // Start analysis
    onAnalyze(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm github-card border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Repository Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            GitHub Repository URL
          </label>
          <div className="flex relative">
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pr-12"
            />
          </div>
          <p className="text-xs text-gray-500">
            Example: https://github.com/facebook/react
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Your API key is stored in your browser and never sent to our servers.
          </p>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Repository...
            </>
          ) : (
            "Generate Repository Reveal"
          )}
        </Button>
      </form>
    </div>
  );
};

export default RepositoryInput;
