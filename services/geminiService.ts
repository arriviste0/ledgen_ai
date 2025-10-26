import { GoogleGenAI } from "@google/genai";
import { type Lead, type GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateLeadsParams {
    businessType: string;
    location: string;
    numberOfLeads: number;
    requirements?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

// Omitting id and status as they are added client-side
type RawLead = Omit<Lead, 'id' | 'status'>;

interface GenerateLeadsResult {
    leads: RawLead[];
    sources: GroundingChunk[];
}

export interface Strategy {
    businessType: string;
    locations: string[];
    requirements: string;
}


export const generateStrategy = async (problem: string): Promise<Strategy> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyze the following business problem and generate a concise lead generation strategy.
        Problem: "${problem}"

        Based on this, identify:
        1.  The ideal type of business to target (businessType).
        2.  A list of 3-5 specific cities or regions that would be good starting points (locations).
        3.  One or two key requirements or characteristics these businesses should have (requirements).

        Return the response as a single, valid JSON object with the keys "businessType", "locations" (an array of strings), and "requirements".
        Example response: {"businessType": "High-end Coffee Shops", "locations": ["San Francisco, CA", "Seattle, WA", "Portland, OR"], "requirements": "offers oat milk and free wifi"}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const textResponse = response.text.trim();
        return JSON.parse(textResponse) as Strategy;

    } catch (error) {
        console.error("Error generating strategy:", error);
        if (error instanceof Error) {
            throw new Error(`The AI failed to generate a strategy: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the strategy.");
    }
};


export const generateLeads = async ({ businessType, location, numberOfLeads, requirements, coordinates }: GenerateLeadsParams): Promise<GenerateLeadsResult> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate a detailed list of up to ${numberOfLeads} of the best matching "${businessType}" in ${location}. ${requirements ? `Strictly prioritize businesses that meet these criteria: "${requirements}".` : ''} For each business, provide its name, specific category, full address, phone number, website URL, Google Maps rating (as a number from 1-5), the total count of reviews (as a number), and typical opening hours (as a string like "Mon-Fri 9am-5pm"). Return the response as a single, valid JSON array of objects. Each object must have the following keys: "name", "category", "address", "phone", "website", "rating", "reviewsCount", "openingHours". If a piece of information is not available, use null for that key. Do not include any businesses that do not fit the requested business type.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: coordinates ? {
                    retrievalConfig: {
                        latLng: {
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude
                        }
                    }
                } : undefined,
            },
        });

        const textResponse = response.text.trim();
        let leads: RawLead[] = [];
        
        const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                leads = JSON.parse(jsonMatch[0]);
            } catch (jsonError) {
                console.error("Failed to parse JSON from response:", jsonError);
                throw new Error("The AI returned a response, but it was not in the expected format. Please try again.");
            }
        } else {
             throw new Error("The AI did not return a valid list. Please try a different query.");
        }
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

        return { leads, sources };

    } catch (error) {
        console.error("Error generating leads:", error);
        if (error instanceof Error) {
            throw new Error(`An error occurred while fetching leads: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching leads.");
    }
};