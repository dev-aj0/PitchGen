
import { Repository } from "@/types";
import { Calendar, Code, GitFork, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RepoInfoProps {
  repository: Repository;
}

const RepoInfo = ({ repository }: RepoInfoProps) => {
  // Format the updated date
  const formattedDate = new Date(repository.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm github-card border border-gray-100 mb-8">
      <div className="flex items-center space-x-4">
        {repository.owner.avatarUrl && (
          <img 
            src={repository.owner.avatarUrl} 
            alt={`${repository.owner.login}'s avatar`} 
            className="w-12 h-12 rounded-full border border-gray-200"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{repository.name}</h2>
          <p className="text-sm text-gray-600">by {repository.owner.login}</p>
        </div>
      </div>

      {repository.description && (
        <p className="mt-4 text-gray-800">{repository.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {repository.language && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Code className="h-3.5 w-3.5" />
            {repository.language}
          </Badge>
        )}
        
        <Badge variant="secondary" className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {repository.stars.toLocaleString()}
        </Badge>
        
        <Badge variant="secondary" className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" />
          {repository.forks.toLocaleString()}
        </Badge>
        
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
        </Badge>
      </div>

      {repository.topics.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {repository.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="bg-brand-purple/10 text-brand-purple border-brand-purple/20">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <a 
            href={repository.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-brand-purple hover:underline"
          >
            View on GitHub →
          </a>
          
          {repository.homepage && (
            <a 
              href={repository.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-brand-purple hover:underline"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoInfo;
