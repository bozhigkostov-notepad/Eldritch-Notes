
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async consultTheSage(noteContent: string) {
    try {
      // Using gemini-3-pro-preview with max thinking budget for deep insights
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `As an ancient RPG Sage, analyze this note and provide a brief lore-inspired summary and 3 "creative sparks" (suggestions) to expand it.\n\nNote Content:\n${noteContent}`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        },
      });

      return response.text || "The Sage is currently meditating and cannot provide an answer.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The connection to the ethereal realm was lost.";
    }
  }
}

export const geminiService = new GeminiService();
