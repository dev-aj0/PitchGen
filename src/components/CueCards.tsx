
import { PitchScript } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Presentation } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CueCardsProps {
  pitch: PitchScript;
  presentersCount: number;
}

const CueCards = ({ pitch, presentersCount }: CueCardsProps) => {
  const [currentCard, setCurrentCard] = useState(0);

  const sections = [
    { title: "Introduction", content: pitch.intro },
    { title: "Problem", content: pitch.problem },
    { title: "Solution", content: pitch.solution },
    { title: "Key Features", content: pitch.features },
    { title: "Technology", content: pitch.tech },
    { title: "Conclusion", content: pitch.conclusion }
  ];

  // Distribute sections among presenters
  const sectionsPerPresenter = Math.ceil(sections.length / presentersCount);
  const presenterSections = Array.from({ length: presentersCount }, (_, i) => 
    sections.slice(i * sectionsPerPresenter, (i + 1) * sectionsPerPresenter)
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm github-card border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Presentation className="w-5 h-5" />
          Presentation Cue Cards
        </h2>
      </div>

      <div className="space-y-6">
        {presenterSections.map((presenterSection, presenterIndex) => (
          <Card key={presenterIndex} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium">Presenter {presenterIndex + 1}</h3>
              </div>
              <div className="p-4 space-y-4">
                {presenterSection.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">{section.title}</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="text-brand-purple border-brand-purple/30 hover:bg-brand-purple/5"
          onClick={() => {
            const content = presenterSections
              .map((sections, i) => 
                `Presenter ${i + 1}:\n\n${sections
                  .map(s => `${s.title}\n${s.content}`)
                  .join('\n\n')}`
              )
              .join('\n\n---\n\n');
            navigator.clipboard.writeText(content);
            toast.success("Cue cards copied to clipboard!");
          }}
        >
          Copy All Cards
        </Button>
      </div>
    </div>
  );
};

export default CueCards;
