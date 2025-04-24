
import { AnalysisResult } from "@/types";
import { jsPDF } from "jspdf";
import 'svg2pdf.js';
import autoTable from 'jspdf-autotable';

export class PDFService {
  static async generatePDF(result: AnalysisResult): Promise<Blob> {
    const { analysis, repoData } = result;
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set font styles
    doc.setFont("helvetica", "bold");
    
    // Add header with project name
    doc.setFontSize(24);
    doc.setTextColor(124, 58, 237); // Purple color
    doc.text(analysis.projectName, 20, 20);
    
    // Add tagline
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(analysis.tagline, 20, 30);
    
    // Add horizontal line
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Add project info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Problem", 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const problemLines = doc.splitTextToSize(analysis.problem, 170);
    doc.text(problemLines, 20, 52);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Solution", 20, 52 + problemLines.length * 7);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const solutionY = 52 + problemLines.length * 7 + 7;
    const solutionLines = doc.splitTextToSize(analysis.solution, 170);
    doc.text(solutionLines, 20, solutionY);
    
    // Tech Stack
    const techStackY = solutionY + solutionLines.length * 7 + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Tech Stack", 20, techStackY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const techStackLines = doc.splitTextToSize(analysis.techStack.join(", "), 170);
    doc.text(techStackLines, 20, techStackY + 7);
    
    // Key Features
    const keyFeaturesY = techStackY + techStackLines.length * 7 + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Key Features", 20, keyFeaturesY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let featureY = keyFeaturesY + 7;
    
    analysis.keyFeatures.forEach((feature, index) => {
      doc.text(`• ${feature}`, 20, featureY);
      featureY += 7;
    });
    
    // Usage
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Usage", 20, featureY + 3);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const usageLines = doc.splitTextToSize(analysis.usageInstructions, 170);
    doc.text(usageLines, 20, featureY + 10);
    
    // Links
    const linksY = featureY + usageLines.length * 7 + 13;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Links", 20, linksY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 238); // Link color (blue)
    doc.text("GitHub Repository", 20, linksY + 7);
    doc.link(20, linksY + 4, 50, 7, { url: analysis.githubUrl });
    
    if (analysis.demoUrl) {
      doc.text("Live Demo", 20, linksY + 14);
      doc.link(20, linksY + 11, 30, 7, { url: analysis.demoUrl });
    }
    
    // Add footer with repo information
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const footerText = `Generated for ${repoData.fullName} • ${new Date().toLocaleDateString()}`;
    doc.text(footerText, 20, 287);
    
    // Return the PDF as a blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  }
}
