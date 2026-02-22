import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import mammoth from "mammoth";
import OpenAI from "openai";

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post('/api/parse', upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      let text = "";
      const ext = req.file.originalname.split('.').pop()?.toLowerCase();
      
      if (ext === 'pdf') {
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } else if (ext === 'docx') {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = result.value;
      } else {
        return res.status(400).json({ message: "Unsupported file format. Please upload PDF or DOCX." });
      }
      
      res.json({ text });
    } catch (error: any) {
      console.error("Parse error:", error);
      res.status(500).json({ message: error.message || "Failed to parse file" });
    }
  });

  app.post(api.analyze.path, async (req, res) => {
    try {
      const input = api.analyze.input.parse(req.body);
      
      const systemPrompt = `You are an expert ATS (Applicant Tracking System) Analyzer.
Perform a deep structural, contextual, and content-level analysis of the provided resume text, simulating systems like Workday, Taleo, Greenhouse.
${input.jobDescription ? "A Job Description is provided. Evaluate the resume against this JD." : "No Job Description provided. Evaluate based on general best practices."}

Analyze based on:
1. Structural & Format Checks (missing sections, bad formatting)
2. Content Quality (weak verbs, missing metrics, vague language, clichés, tense consistency, bullet length, job titles, date formats, gaps)
3. ATS Keyword & Scoring (hard/soft skills match against JD if provided)

Output a JSON object EXACTLY matching this structure:
{
  "formatScore": number, // 0-100
  "contentScore": number, // 0-100
  "keywordScore": number, // 0-100, omit if no JD
  "readabilityScore": number, // 0-100
  "overallScore": number, // 0-100
  "issues": [
    {
      "type": "format" | "content" | "keyword",
      "severity": "critical" | "warning" | "suggestion",
      "text": "Exact text from the resume that has the issue",
      "message": "Short description of the issue",
      "reason": "Why ATS rejects or penalizes this",
      "suggestion": "Concrete rewritten text to replace the issue"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Resume:\n${input.resumeText}\n\n${input.jobDescription ? `Job Description:\n${input.jobDescription}` : ''}` }
        ],
        response_format: { type: "json_object" }
      });

      const resultText = response.choices[0].message?.content;
      if (!resultText) throw new Error("Empty response from AI");
      
      const analysisResult = JSON.parse(resultText);
      
      await storage.saveAnalysis({
        resumeText: input.resumeText,
        jobDescription: input.jobDescription || null,
        results: analysisResult
      });

      res.status(200).json(analysisResult);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Analyze error:", err);
      res.status(500).json({ message: "Failed to analyze resume" });
    }
  });

  return httpServer;
}
