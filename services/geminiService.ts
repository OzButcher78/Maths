import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const isNameInappropriate = async (name: string): Promise<boolean> => {
  try {
    const prompt = `You are a strict content moderation bot for a kids game leaderboard. Your only task is to determine if a given name is inappropriate. Inappropriate names include any profanity, offensive language, slurs, URLs, email addresses, or personally identifiable information. If the name is inappropriate, respond with the single word "true". If the name is appropriate and safe for kids, respond with the single word "false". Do not provide any explanation or punctuation. Just the word true or false. Here is the name: "${name}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const textResponse = response.text.trim().toLowerCase();
    
    return textResponse === 'true';

  } catch (error) {
    console.error("Error checking name with Gemini API:", error);
    // In case of an API error, default to allowing the name to not block the user.
    return false;
  }
};