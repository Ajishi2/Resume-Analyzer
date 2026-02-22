import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description"),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

// Request/Response types
export const analyzeRequestSchema = z.object({
  resumeText: z.string().min(10, "Resume text is too short"),
  jobDescription: z.string().optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const issueSchema = z.object({
  type: z.enum(["format", "content", "keyword"]),
  severity: z.enum(["critical", "warning", "suggestion"]),
  text: z.string(), // The specific text flagged from the resume
  message: z.string(), // What the issue is
  reason: z.string(), // Why ATS rejects it
  suggestion: z.string(), // Suggested replacement text
});

export type Issue = z.infer<typeof issueSchema>;

export const analysisResponseSchema = z.object({
  formatScore: z.number(),
  contentScore: z.number(),
  keywordScore: z.number().optional(),
  readabilityScore: z.number(),
  overallScore: z.number(),
  issues: z.array(issueSchema),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
