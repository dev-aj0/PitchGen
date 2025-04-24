
import { PitchScript } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface PitchDisplayProps {
  pitch: PitchScript;
  presentersCount: number;
}

const PitchDisplay = ({ pitch, presentersCount }: PitchDisplayProps) => {
  const [tabValue, setTabValue] = useState<string>("full");

  const estimatedSeconds = Math.ceil(pitch.fullScript.split(" ").length / 2.5);
  const estimatedTime = `${Math.floor(estimatedSeconds / 60)}:${String(estimatedSeconds % 60).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm github-card border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pitch Script</h2>
        <span className="text-sm text-gray-500">Est. {estimatedTime} min</span>
      </div>

      <Tabs defaultValue="full" value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="full">Full Script</TabsTrigger>
          <TabsTrigger value="sections">By Section</TabsTrigger>
        </TabsList>
        
        <TabsContent value="full">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-800 whitespace-pre-line">{pitch.fullScript}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sections">
          <div className="space-y-4">
            {[
              { title: "Introduction", content: pitch.intro },
              { title: "Problem", content: pitch.problem },
              { title: "Solution", content: pitch.solution },
              { title: "Features", content: pitch.features },
              { title: "Technology", content: pitch.tech },
              { title: "Conclusion", content: pitch.conclusion }
            ].map((section) => (
              <Card key={section.title} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h3 className="font-medium text-sm">{section.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800">{section.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          className="text-brand-purple border-brand-purple/30 hover:bg-brand-purple/5"
          onClick={() => {
            navigator.clipboard.writeText(pitch.fullScript);
            toast.success("Script copied to clipboard!");
          }}
        >
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};

export default PitchDisplay;
