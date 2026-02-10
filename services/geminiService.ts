
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  // Fix: Move GoogleGenAI instantiation inside the method and use process.env.API_KEY directly as per guidelines.
  async consultTheSage(noteContent: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-3-pro-preview with max thinking budget for deep insights.
      const response = await ai.models.generateContent({
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
