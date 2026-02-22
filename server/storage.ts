import { db } from "./db";
import { analyses, type InsertAnalysis, type Analysis } from "@shared/schema";

export interface IStorage {
  saveAnalysis(data: InsertAnalysis): Promise<Analysis>;
}

export class DatabaseStorage implements IStorage {
  async saveAnalysis(data: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db.insert(analyses).values(data).returning();
    return analysis;
  }
}

export const storage = new DatabaseStorage();
