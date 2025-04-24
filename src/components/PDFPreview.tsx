
import { AnalysisResult } from "@/types";
import { useState, useEffect } from "react";
import { PDFService } from "@/services/pdf-service";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PDFPreviewProps {
  result: AnalysisResult;
}

const PDFPreview = ({ result }: PDFPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generatePDF();
  }, [result]);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await PDFService.generatePDF(result);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      const fileName = `${result.repoData.name}-reveal.pdf`;
      
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Project Summary PDF</h2>
          <Button 
            onClick={handleDownload}
            disabled={!pdfUrl || isGenerating}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
        
        <div className="p-6">
          {isGenerating ? (
            <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto"></div>
                <p className="mt-4 text-gray-600">Generating PDF preview...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <div className="pdf-preview rounded overflow-hidden">
              <iframe 
                src={pdfUrl} 
                className="w-full h-[600px] border-0"
                title="PDF Preview"
              />
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">PDF preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
