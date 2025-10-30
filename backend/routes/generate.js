// In file: backend/routes/generate.js

const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require('../middleware/authMiddleware.js');
require('dotenv').config();
const axios = require('axios');
const router = express.Router();

// This line handles either API key name from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

// Helper function to convert image data for Gemini
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

// All models are initialized once for better performance
const reportModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
const valuationModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
const assistantModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an expert AI assistant for farmers in India named "Pashu Mitra AI". Provide helpful, safe, and practical advice on cattle and buffalo care, focusing on breed information, nutrition, and general well-being. If a user asks about a serious health issue, advise them to consult a qualified local veterinarian immediately. Keep answers concise and easy to understand.`
});

// ROUTE 1: HYBRID REPORT
router.post('/report', protect, async (req, res) => {
    console.log('Request received at /api/generate/report');
    const { base64Image, mimeType, location, language, yoloBreed } = req.body;

    if (!base64Image || !mimeType) {
        return res.status(400).json({ error: 'Image data is missing.' });
    }

    try {
        const imagePart = { inlineData: { data: base64Image, mimeType: mimeType } };
        let yoloHint = `My custom vision model has detected the breed as '${yoloBreed}'. Please verify this.`;
        if (!yoloBreed) yoloHint = "My custom vision model did not provide an initial detection.";
        
        const textPart = `
    You are 'Pashu Sahayak AI', an expert AI for the Indian subcontinent. Your task is to analyze the provided image and generate a report.

    **CRITICAL INSTRUCTION:** First, verify if the image contains cattle, a cow, or a buffalo. 
    - If it **DOES NOT**, you MUST return a simple JSON object with only one key: {"error": "Image does not contain cattle."}.
    - If it **DOES**, you MUST generate a full report in a single, valid JSON object with the following top-level keys and nothing else: "advanced_breed_detector" and "hyper_local_advisor".

    **DETAILED REQUIREMENTS:**
    - "advanced_breed_detector": MUST contain "primary_breed", "confidence_score", "breed_origin", "breed_formation", and an array of strings called "key_identifiers".
    - "hyper_local_advisor": MUST contain "feeding_tip", "housing_tip", "seasonal_tip", and the "language".

    CONTEXT: My custom vision model detected the breed as '${yoloBreed || 'Not available'}'. Please verify this.
    LOCATION: ${location}, India
    LANGUAGE: ${language}
`;
        
        const result = await reportModel.generateContent([textPart, imagePart]);
        const responseText = result.response.text();

        // Robust JSON parsing to handle potential extra text from the AI
        const startIndex = responseText.indexOf('{');
        const endIndex = responseText.lastIndexOf('}');
        const jsonString = responseText.substring(startIndex, endIndex + 1);
        
        const report = JSON.parse(jsonString);

        console.log('✅ Hybrid report generated successfully.');
        res.json(report);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for report:', error);
        res.status(500).json({ error: 'Failed to generate AI report.' });
    }
});

// ROUTE 2: VALUATION
router.post('/valuation', protect, async (req, res) => {
    console.log('Request received at /api/generate/valuation');
    const inputs = req.body;
    try {
        const prompt = `Calculate the fair market value for a livestock animal with these characteristics:
        - Breed: ${inputs.breed}, Age: ${inputs.age} years, Peak Milk Yield: ${inputs.milkYield} liters/day, Health Condition: ${inputs.health}, Location: ${inputs.location}.
        Provide a realistic price range in INR and list the key valuation factors. The output must be a single, valid JSON object.`;
        
        const result = await valuationModel.generateContent(prompt);
        const responseText = result.response.text();

        // Robust JSON parsing
        const startIndex = responseText.indexOf('{');
        const endIndex = responseText.lastIndexOf('}');
        const jsonString = responseText.substring(startIndex, endIndex + 1);

        const valuation = JSON.parse(jsonString);
        
        console.log('✅ Valuation generated successfully.');
        res.json(valuation);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for valuation:', error);
        res.status(500).json({ error: 'Failed to generate valuation.' });
    }
});

// ROUTE 3: AI ASSISTANT
router.post('/assistant', protect, async (req, res) => {
    console.log('Request received at /api/generate/assistant (Ollama)');
    const { message } = req.body;
    const ollamaUrl = process.env.OLLAMA_URL;

    if (!ollamaUrl) {
        return res.status(500).json({ error: "Ollama URL is not configured on the server." });
    }

    try {
        // THIS IS THE FIX: Use axios with a longer timeout
        const ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, 
            {
                model: "llama3:8b",
                prompt: message,
                stream: false
            },
            {
                timeout: 90000 // Wait for up to 90 seconds for a response
            }
        );

        res.send(ollamaResponse.data.response);

    } catch (error) {
        console.error('❌ Error calling Ollama service:', error.message);
        res.status(500).json({ error: 'Failed to get AI assistant response from Ollama.' });
    }
});


module.exports = router;