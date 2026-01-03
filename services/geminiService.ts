import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIAsset = async (prompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for general image generation tasks as per guidelines
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // No responseMimeType for image models
      }
    });

    let imageUrl = '';
    
    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
           const base64Data = part.inlineData.data;
           const mimeType = part.inlineData.mimeType;
           imageUrl = `data:${mimeType};base64,${base64Data}`;
           break;
        }
      }
    }

    if (!imageUrl) {
        throw new Error("No image generated found in response");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error generating AI asset:", error);
    throw error;
  }
};

export const generateAIScript = async (topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a short, engaging 30-second video script about: ${topic}. Format it as a JSON list of scenes with "time" and "description".`,
            config: {
                responseMimeType: "application/json"
            }
        });
        return response.text || "[]";
    } catch (error) {
        console.error("Error generating script:", error);
        return "[]";
    }
}
