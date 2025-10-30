// In file: frontend/src/services/geminiService.js

// --- CORRECTED LIVE URLS ---
const NODE_BACKEND_URL = import.meta.env.VITE_NODE_BACKEND_URL;
const PYTHON_YOLO_URL = import.meta.env.VITE_PYTHON_YOLO_URL;
const OLLAMA_CHATBOT_URL = import.meta.env.VITE_OLLAMA_CHATBOT_URL;
// -----------------------------------------

// Helper function to read a file and convert it to a base64 string
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

export async function detectBreedWithYOLOv8(imageFile) {
    const endpoint = `${PYTHON_YOLO_URL}/predict`;
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
        const response = await fetch(endpoint, { method: 'POST', body: formData });
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Breed detection failed on the Python server.'); }
        return await response.json();
    } catch (error) {
        console.error('❌ Error calling the YOLOv8 backend:', error);
        throw error;
    }
}

export async function getPashuSahayakReport(base64Image, mimeType, location, language, yoloBreed) {
    const storedUser = JSON.parse(sessionStorage.getItem('cattle-classifier-user'));
    if (!storedUser || !storedUser.token) throw new Error("Authentication token not found.");
    try {
        const response = await fetch(`${NODE_BACKEND_URL}/api/generate/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
            body: JSON.stringify({ base64Image, mimeType, location, language, yoloBreed })
        });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Failed to get report from backend.'); }
        return await response.json();
    } catch (error) {
        console.error("Error getting Pashu Sahayak report:", error);
        throw error;
    }
}

export const getAIAssistantResponse = async (message, imageObject) => {
    const endpoint = `${OLLAMA_CHATBOT_URL}/api/generate`;
    try {
        let requestBody = {
            model: "llava:latest", // LLaVA is a great multimodal model
            prompt: message,
            stream: false
        };

        // If an image is provided, add it to the request body in the correct format
        if (imageObject && imageObject.file) {
            const imageBase64 = await fileToBase64(imageObject.file);
            requestBody.images = [imageBase64];
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Ollama server responded with an error.');
        }

        const data = await response.json();
        return data.response;
    
    } catch (error) {
        console.error('❌ Error calling the Ollama backend service:', error);
        throw error;
    }
};

export const getLivestockValuation = async (valuationData) => {
    const storedUser = JSON.parse(sessionStorage.getItem('cattle-classifier-user'));
    if (!storedUser || !storedUser.token) throw new Error("You must be logged in to get a valuation.");
    try {
        const response = await fetch(`${NODE_BACKEND_URL}/api/generate/valuation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
            body: JSON.stringify(valuationData)
        });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Failed to get valuation from the server.'); }
        return await response.json();
    } catch (error) {
        console.error('❌ Error getting valuation report:', error);
        throw error;
    }
};