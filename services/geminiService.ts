import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ModerationResult } from "../types";

// Helper to get API key safely
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

// Initialize Gemini Client
const initGemini = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const moderatePrayerContent = async (text: string): Promise<ModerationResult> => {
  const ai = initGemini();
  if (!ai) {
    return { safe: true, suggestedTags: ["#General"] }; // Fallback if no API key
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the following prayer request for a Christian platform. 
      1. Check if it contains offensive, hateful, or inappropriate content. 
      2. Suggest up to 3 short hashtags (e.g., #Healing, #Peace).
      
      Prayer: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            suggestedTags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from Gemini");
    
    return JSON.parse(jsonStr) as ModerationResult;
  } catch (error) {
    console.error("Moderation failed:", error);
    // Fail safe mostly to allow testing if API limits hit, but in prod you might fail closed
    return { safe: true, suggestedTags: ["#Prayer"] };
  }
};

export const getSpiritualGuidance = async (
  history: ChatMessage[], 
  newMessage: string
): Promise<string> => {
  const ai = initGemini();
  if (!ai) return "I am unable to connect to the spiritual guidance service at the moment.";

  try {
    // Convert app history to Gemini format
    // limiting history to last 10 messages to save tokens
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: recentHistory,
      config: {
        systemInstruction: "You are a compassionate, wise, and non-judgmental Christian prayer partner and spiritual guide. Your goal is to offer comfort, relevant scripture (NIV or ESV), and short prayers. Keep responses concise, warm, and encouraging. Do not be overly preachy, but be deeply rooted in faith.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I am listening...";
  } catch (error) {
    console.error("Chat error:", error);
    return "I apologize, I am having trouble finding the right words right now. Please try again.";
  }
};