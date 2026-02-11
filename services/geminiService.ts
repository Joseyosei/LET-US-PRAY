
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
    return { safe: true, suggestedTags: ["#General"] }; 
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the following text for a Christian platform. 
      1. Check if it contains offensive, hateful, or inappropriate content. 
      2. Suggest up to 3 short hashtags (e.g., #Healing, #Peace).
      
      Text: "${text}"`,
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

export const optimizeTestimony = async (draftDescription: string): Promise<{title: string, summary: string, tags: string[]}> => {
  const ai = initGemini();
  if (!ai) throw new Error("AI Service unavailable");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are a professional content editor for a Christian Testimony app. 
      Analyze the user's rough draft and generate:
      1. An engaging, spiritual Title (max 60 chars).
      2. A polished, inspiring Summary (max 200 chars).
      3. 3-5 relevant hashtags.
      
      Draft: "${draftDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from Gemini");
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Optimization failed:", error);
    throw error;
  }
};

/**
 * Generate a cinematic video testimony using Veo 3.1
 */
export const generateVideoTestimony = async (prompt: string): Promise<string> => {
  const ai = initGemini();
  if (!ai) throw new Error("AI Service unavailable");

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic, spiritual Christian testimony video: ${prompt}. Highly aesthetic, emotional, lighting like a professional film. 4K quality.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed to return a link");
    
    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};
