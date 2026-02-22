import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, X, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import type { Issue } from "@shared/routes";

interface HighlightTextProps {
  text: string;
  issues: Issue[];
  onApplyFix: (issue: Issue) => void;
}

export function HighlightText({ text, issues, onApplyFix }: HighlightTextProps) {
  // If no issues, just return the raw text
  if (!issues || issues.length === 0) {
    return <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800">{text}</div>;
  }

  // To highlight safely, we build a robust replacement function
  const renderTextWithHighlights = () => {
    let elements: React.ReactNode[] = [text];

    // Sort issues by length descending to prevent nested matching issues
    const sortedIssues = [...issues].sort((a, b) => b.text.length - a.text.length);

    sortedIssues.forEach((issue, index) => {
      const newElements: React.ReactNode[] = [];
      elements.forEach((el) => {
        if (typeof el === "string") {
          // Case insensitive split
          const regex = new RegExp(`(${escapeRegExp(issue.text)})`, "gi");
          const parts = el.split(regex);
          
          parts.forEach((part, i) => {
            // Because we grouped the regex, the matched text is included in the array
            if (part.toLowerCase() === issue.text.toLowerCase()) {
              newElements.push(
                <IssueHighlight 
                  key={`${index}-${i}`} 
                  issue={issue} 
                  originalText={part}
                  onApply={() => onApplyFix(issue)} 
                />
              );
            } else if (part) {
              newElements.push(part);
            }
          });
        } else {
          newElements.push(el);
        }
      });
      elements = newElements;
    });

    return elements;
  };

  return (
    <div className="whitespace-pre-wrap font-serif text-[15pt] leading-[1.8] text-slate-800" id="printable-resume">
      {renderTextWithHighlights()}
    </div>
  );
}

function IssueHighlight({ issue, originalText, onApply }: { issue: Issue, originalText: string, onApply: () => void }) {
  const [open, setOpen] = useState(false);

  const getHighlightClass = (severity: string) => {
    if (severity === "critical") return "highlight-critical";
    if (severity === "warning") return "highlight-warning";
    return "highlight-suggestion";
  };

  const getIcon = () => {
    if (issue.severity === "critical") return <AlertCircle className="w-4 h-4 text-red-600" />;
    if (issue.severity === "warning") return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <Info className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span className={clsx(getHighlightClass(issue.severity), "no-print-bg")}>
          {originalText}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="z-50 w-80 rounded-xl bg-white p-4 shadow-2xl border border-slate-100 outline-none animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
          sideOffset={5}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm leading-tight">{issue.message}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{issue.reason}</p>
              </div>
              
              {issue.suggestion && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Suggestion</div>
                  <div className="text-sm font-medium text-emerald-700 font-mono leading-tight">
                    "{issue.suggestion}"
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onApply();
                    setOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {issue.suggestion ? "Apply Fix" : "Remove"}
                </button>
                <Popover.Close asChild>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </Popover.Close>
              </div>
            </div>
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Utility to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
