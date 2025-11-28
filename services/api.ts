import { GoogleGenAI, Type } from "@google/genai";
import { ClipResult } from "../types";
import { MODEL_VIDEO_ANALYSIS, SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeClips = async (
  videoBase64: string,
  videoMimeType: string,
  images: { base64: string; mimeType: string; originalName: string }[]
): Promise<ClipResult[]> => {
  
  try {
    // 1. Prepare the video part
    const videoPart = {
      inlineData: {
        data: videoBase64,
        mimeType: videoMimeType,
      },
    };

    // 2. Prepare image parts with text context for mapping
    const contentParts: any[] = [videoPart];
    
    // Add text intro
    contentParts.push({
      text: "以上是完整的源视频。以下是需要命名的切片视频的封面截图。"
    });

    images.forEach((img, index) => {
      contentParts.push({
        text: `切片 #${index + 1} (原始文件名: ${img.originalName}):`
      });
      contentParts.push({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType
        }
      });
    });

    contentParts.push({
      text: "请根据源视频上下文分析这些切片封面，并返回 JSON 格式的命名建议。"
    });

    // 3. Define Schema
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalName: { type: Type.STRING, description: "Prompt中提供的原始文件名" },
          suggestedName: { type: Type.STRING, description: "建议的中文文件名" },
          reasoning: { type: Type.STRING, description: "中文命名理由简述" }
        },
        required: ["originalName", "suggestedName", "reasoning"]
      }
    };

    // 4. Call API
    const response = await ai.models.generateContent({
      model: MODEL_VIDEO_ANALYSIS,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
      contents: {
        parts: contentParts
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ClipResult[];
    } else {
      throw new Error("API 未返回文本数据");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};