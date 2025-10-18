
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const fileReaderReady = (reader: FileReader): Promise<string> => {
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('FileReader result is not a string'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

const fileToBase64 = async (file: File): Promise<{mimeType: string, data: string}> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const base64Data = await fileReaderReady(reader);
    return { mimeType: file.type, data: base64Data };
};

export const generateImages = async (prompt: string, numImages: number): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: numImages,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error("Error generating images with Imagen:", error);
        throw new Error("Failed to generate images. Please check the console for details.");
    }
};

export const editImage = async (prompt: string, imageFile: File): Promise<string[]> => {
    try {
        const {mimeType, data} = await fileToBase64(imageFile);
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: data,
                  mimeType: mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
              responseModalities: [Modality.IMAGE],
          },
        });
        
        const images: string[] = [];
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
             images.push(part.inlineData.data);
          }
        }
        return images;
    } catch (error) {
        console.error("Error editing image with Nano Banana:", error);
        throw new Error("Failed to edit image. Please check the console for details.");
    }
};
