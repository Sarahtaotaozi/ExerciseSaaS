import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in environment variables");
    process.exit(1);
}


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post('/', async (req: Request, res: Response) => {
    try {
        const { userPrompt } = req.body;
        if (!userPrompt) {
            return res.status(400).json({ error: "Missing userPrompt in request body" });
        }

        console.log("📤 sending request to Gemini API:", userPrompt);


        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.9
            },
            safetySettings: []
        });


        const response = await model.generateContent({
            contents: [{
                role: "user",
                parts: [
                    { text: `Generate a short creative story based on: ${userPrompt}` },
                    { text: "Also generate an AI-generated image based on the story. Return the image in base64 format." }
                ]
            }]
        });

        console.log("📥 Gemini API Response:", response.response);

        if (!response.response || !response.response.candidates) {
            return res.status(500).json({ error: "Gemini API did not return any content" });
        }

        let generatedStory = "";
        let generatedImage = null;


        for (const part of response.response.candidates[0].content.parts) {
            if (part.text) {
                generatedStory = part.text;
            } else if (part.inlineData) {
                generatedImage = `data:image/png;base64,${part.inlineData.data}`;
            }
        }


        res.json({ story: generatedStory, image: generatedImage });

    } catch (error: any) {
        console.error("❌ Error calling Gemini API:", error);
        res.status(500).json({ error: error.response?.data?.error || "Failed to generate story" });
    }
});

export default router;
