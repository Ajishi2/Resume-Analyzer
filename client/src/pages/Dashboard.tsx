import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, FileText, FileSearch, CheckCircle2, 
  Download, Sparkles, ChevronRight, LayoutDashboard,
  Target, AlertCircle, AlertTriangle, Info
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { clsx } from "clsx";

import { useParseResume, useAnalyzeResume } from "@/hooks/use-resume";
import { ScoreRing } from "@/components/ScoreRing";
import { HighlightText } from "@/components/HighlightText";
import type { Issue } from "@shared/routes";

export default function Dashboard() {
  const [mode, setMode] = useState<"upload" | "workspace">("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [activeIssues, setActiveIssues] = useState<Issue[]>([]);
  
  const parseMutation = useParseResume();
  const analyzeMutation = useAnalyzeResume();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        const text = await parseMutation.mutateAsync(file);
        setResumeText(text);
        setMode("workspace");
      } catch (error) {
        console.error("Parse error", error);
      }
    }
  }, [parseMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!resumeText) return;
    try {
      const results = await analyzeMutation.mutateAsync({
        resumeText,
        jobDescription: jobDescription || undefined
      });
      setActiveIssues(results.issues);
    } catch (error) {
      console.error("Analysis error", error);
    }
  };

  const handleApplyFix = (issue: Issue) => {
    setResumeText(prev => prev.replace(issue.text, issue.suggestion));
    setActiveIssues(prev => prev.filter(i => i !== issue));
  };

  const handleFixAll = () => {
    let newText = resumeText;
    activeIssues.forEach(issue => {
      newText = newText.replace(issue.text, issue.suggestion);
    });
    setResumeText(newText);
    setActiveIssues([]);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="no-print h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ATS<span className="text-slate-400">Optimizer</span></span>
        </div>
        
        {mode === "workspace" && (
          <div className="flex items-center gap-3">
            {activeIssues.length > 0 && (
              <button
                onClick={handleFixAll}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Fix All Issues ({activeIssues.length})
              </button>
            )}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all text-sm shadow-md shadow-slate-900/20 disabled:opacity-50"
            >
              {analyzeMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileSearch className="w-4 h-4" />
              )}
              Analyze Resume
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center p-8"
            >
              <div className="max-w-2xl w-full space-y-8 text-center">
                <div className="space-y-4">
                  <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
                    Beat the ATS.<br />Land the interview.
                  </h1>
                  <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Upload your resume and a target job description. Our AI analyzes formatting, keywords, and impact to ensure your resume passes automated filters.
                  </p>
                </div>

                <div 
                  {...getRootProps()} 
                  className={clsx(
                    "mt-8 p-16 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer bg-white shadow-xl shadow-slate-200/50 group",
                    isDragActive ? "border-slate-900 bg-slate-50" : "border-slate-300 hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-200/60",
                    parseMutation.isPending && "opacity-50 pointer-events-none"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 group-hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors">
                      {parseMutation.isPending ? (
                         <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                      ) : (
                        <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-slate-700">
                        {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                      </p>
                      <p className="text-slate-400 mt-2">Supports PDF, DOCX (Max 5MB)</p>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex overflow-hidden w-full"
            >
              {/* LEFT PANEL - Workspace */}
              <div className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50 relative overflow-hidden">
                
                {/* JD Input Area (Collapsible) */}
                <div className="no-print border-b border-slate-200 bg-white p-4 shadow-sm z-10">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Job Description (Optional)</label>
                  <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get keyword matching scores..."
                    className="w-full h-20 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-mono"
                  />
                </div>

                {/* Resume Editor/Viewer */}
                <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
                  <div className="max-w-[800px] mx-auto bg-white rounded-none sm:rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-full p-8 sm:p-12 mb-12">
                    <HighlightText 
                      text={resumeText} 
                      issues={activeIssues} 
                      onApplyFix={handleApplyFix}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL - Analytics */}
              <div className="no-print w-[400px] bg-white flex flex-col flex-shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)]">
                {analyzeMutation.data ? (
                  <Tabs.Root defaultValue="overview" className="flex flex-col h-full">
                    <Tabs.List className="flex border-b border-slate-200 px-2 pt-2">
                      {['overview', 'issues'].map(tab => (
                        <Tabs.Trigger 
                          key={tab}
                          value={tab}
                          className="flex-1 py-3 px-4 text-sm font-semibold text-slate-500 capitalize tracking-wide hover:text-slate-700 data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-slate-900 transition-all"
                        >
                          {tab}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>

                    <div className="flex-1 overflow-y-auto p-6">
                      <Tabs.Content value="overview" className="space-y-10 outline-none">
                        <div className="flex flex-col items-center pt-4">
                          <ScoreRing score={analyzeMutation.data.overallScore} label="ATS Match Score" size="lg" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <ScoreRing score={analyzeMutation.data.formatScore} label="Formatting" />
                          <ScoreRing score={analyzeMutation.data.contentScore} label="Content Impact" />
                          <ScoreRing score={analyzeMutation.data.readabilityScore} label="Readability" />
                          {analyzeMutation.data.keywordScore !== undefined && (
                            <ScoreRing score={analyzeMutation.data.keywordScore} label="Keywords" />
                          )}
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Summary
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            Your resume has good readability, but needs stronger action verbs to increase impact. 
                            {activeIssues.length > 0 ? ` There are ${activeIssues.length} issues to resolve.` : " Great job! Your resume looks solid."}
                          </p>
                        </div>
                      </Tabs.Content>

                      <Tabs.Content value="issues" className="space-y-4 outline-none">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-lg text-slate-900">Found Issues</h3>
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold">
                            {activeIssues.length} Remaining
                          </span>
                        </div>

                        {activeIssues.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <p className="text-slate-500 font-medium">No issues found!</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <AnimatePresence>
                              {activeIssues.map((issue, idx) => (
                                <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className={clsx(
                                    "p-4 rounded-xl border relative overflow-hidden group",
                                    issue.severity === "critical" ? "bg-red-50/50 border-red-100" :
                                    issue.severity === "warning" ? "bg-amber-50/50 border-amber-100" :
                                    "bg-emerald-50/50 border-emerald-100"
                                  )}
                                >
                                  {/* Severity indicator line */}
                                  <div className={clsx(
                                    "absolute left-0 top-0 bottom-0 w-1",
                                    issue.severity === "critical" ? "bg-red-500" :
                                    issue.severity === "warning" ? "bg-amber-500" :
                                    "bg-emerald-500"
                                  )} />
                                  
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                      {issue.severity === "critical" && <AlertCircle className="w-4 h-4 text-red-600" />}
                                      {issue.severity === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                                      {issue.severity === "suggestion" && <Info className="w-4 h-4 text-emerald-600" />}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-sm font-semibold text-slate-900">{issue.message}</h4>
                                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">Found in: "{issue.text}"</p>
                                      
                                      <button 
                                        onClick={() => handleApplyFix(issue)}
                                        className="mt-3 text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                      >
                                        Apply Fix <ChevronRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </Tabs.Content>
                    </div>
                  </Tabs.Root>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                    <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6">
                      <LayoutDashboard className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-lg">Ready for Analysis</h3>
                    <p className="text-sm text-slate-400 mt-2">
                      Click the "Analyze Resume" button to scan for ATS compliance and impact.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
