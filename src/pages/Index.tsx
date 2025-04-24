import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Slider } from "@/components/ui/slider";
import RepositoryInput from "@/components/RepositoryInput";
import RepoInfo from "@/components/RepoInfo";
import PitchDisplay from "@/components/PitchDisplay";
import PDFPreview from "@/components/PDFPreview";
import CueCards from "@/components/CueCards";
import { GitHubService } from "@/services/github-service";
import { AIService } from "@/services/ai-service";
import { AnalysisResult, Repository } from "@/types";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("input");
  const [pitchDuration, setPitchDuration] = useState<number>(180);
  const [presentersCount, setPresentersCount] = useState<number>(2);

  const handleAnalyze = async (url: string) => {
    try {
      setIsLoading(true);
      setCurrentStep("fetching");

      const apiKey = localStorage.getItem("openai_api_key");
      if (!apiKey) {
        toast.error("OpenAI API key not found");
        return;
      }
      AIService.setApiKey(apiKey);

      const repoData = await GitHubService.fetchRepository(url);
      setCurrentStep("analyzing");

      const analysisResult = await AIService.analyzeRepository(repoData, {
        pitchDuration,
        presentersCount
      });

      setResult(analysisResult);
      setCurrentStep("complete");
      toast.success("Repository analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze repository");
      setCurrentStep("input");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <header className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-brand-navy">
          Pitch<span className="text-brand-purple">Gen</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">Transform your repository into a pitch-perfect presentation.</p>
      </header>

      <div className="max-w-5xl mx-auto mb-12">
        {!result && (
          <>
            <RepositoryInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            <div className="mt-8 w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Pitch Settings</h3>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Pitch Duration
                      </label>
                      <span className="text-sm text-gray-500">
                        {Math.floor(pitchDuration / 60)}:{(pitchDuration % 60).toString().padStart(2, '0')} minutes
                      </span>
                    </div>
                    <Slider
                      value={[pitchDuration]}
                      onValueChange={(value) => setPitchDuration(value[0])}
                      min={60}
                      max={600}
                      step={30}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">1 min</span>
                      <span className="text-xs text-gray-500">10 min</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Number of Presenters
                      </label>
                      <span className="text-sm text-gray-500">
                        {presentersCount} presenter{presentersCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    <Slider
                      value={[presentersCount]}
                      onValueChange={(value) => setPresentersCount(value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">1</span>
                      <span className="text-xs text-gray-500">10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {isLoading && (
          <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center flex-col py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
              <p className="mt-4 text-gray-600">
                {currentStep === "fetching" && "Fetching repository data..."}
                {currentStep === "analyzing" && "Analyzing repository content..."}
              </p>
            </div>
          </div>
        )}
        
        {result && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-brand-navy">Analysis Results</h2>
              <button
                onClick={() => {
                  setResult(null);
                  setCurrentStep("input");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Start Over
              </button>
            </div>
            
            <RepoInfo repository={result.repoData} />
            <PitchDisplay pitch={result.pitchScript} presentersCount={presentersCount} />
            <CueCards pitch={result.pitchScript} presentersCount={presentersCount} />
            <PDFPreview result={result} />
          </div>
        )}
      </div>

      <footer className="max-w-5xl mx-auto text-center mt-16 text-gray-500 text-sm">
        <p></p>
      </footer>
    </div>
  );
};

export default Index;
