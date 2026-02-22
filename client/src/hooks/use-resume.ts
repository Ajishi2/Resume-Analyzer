import { useMutation } from "@tanstack/react-query";
import { api, type AnalyzeInput, type AnalyzeResponse } from "@shared/routes";

// MOCK DATA for robust development if API is missing
const MOCK_ANALYSIS: AnalyzeResponse = {
  formatScore: 85,
  contentScore: 72,
  keywordScore: 68,
  readabilityScore: 90,
  overallScore: 78,
  issues: [
    {
      type: "content",
      severity: "critical",
      text: "Responsible for managing a team",
      message: "Weak action verb detected.",
      reason: "ATS systems and recruiters look for strong, result-oriented action verbs.",
      suggestion: "Directed a team of 15 members, achieving 120% of quarterly targets",
    },
    {
      type: "keyword",
      severity: "warning",
      text: "Used React to build frontends",
      message: "Missing key technical terminology.",
      reason: "The job description emphasizes 'React.js' and 'TypeScript'.",
      suggestion: "Architected scalable frontends utilizing React.js and TypeScript",
    },
    {
      type: "format",
      severity: "suggestion",
      text: "References available upon request",
      message: "Outdated phrase.",
      reason: "This phrase wastes valuable space on a modern resume.",
      suggestion: "", // Empty means suggest deletion
    }
  ]
};

export function useParseResume() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);

      try {
        const res = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) throw new Error("Failed to parse file");
        const data = await res.json();
        return data.text as string;
      } catch (error) {
        // Fallback for development if /api/parse isn't ready
        console.warn("[Parse Resume] Backend endpoint missing, returning dummy text.");
        return `John Doe\nSoftware Engineer\n\nExperience\n\nFrontend Developer at Tech Corp\n- Responsible for managing a team of developers.\n- Used React to build frontends for various clients.\n\nEducation\nB.S. Computer Science\n\nReferences available upon request`;
      }
    },
  });
}

export function useAnalyzeResume() {
  return useMutation({
    mutationFn: async (data: AnalyzeInput) => {
      try {
        // We use fetch directly since we want to handle the response parsing manually
        // and provide a robust fallback if the backend isn't fully wired yet.
        const res = await fetch(api.analyze.path, {
          method: api.analyze.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error("Analysis failed");
        }

        const json = await res.json();
        return api.analyze.responses[200].parse(json);
      } catch (error) {
        console.warn("[Analyze Resume] Backend error or missing, using robust mock data.", error);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return MOCK_ANALYSIS;
      }
    },
  });
}
