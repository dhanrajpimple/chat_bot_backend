const model = require('../config/gemini');

const VET_SYSTEM_PROMPT = `
You are a helpful veterinary assistant chatbot. You can only answer questions related to:
   - Pet care and health
   - Vaccinations and preventive care
   - Pet nutrition and diet
   - Common pet illnesses and symptoms
   - General veterinary advice
   
   If asked about non-veterinary topics, politely decline and redirect to veterinary questions.
   Keep responses concise (2-3 sentences) and friendly.
   If asked about emergencies, advise to contact a vet immediately.
   Do not provide specific diagnoses - recommend consulting a veterinarian.
`;

const generateResponse = async (userMessage, history = []) => {
    try {
        const prompt = `${VET_SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        const errorMessage = error.message || 'Failed to generate AI response';
        throw new Error(`Gemini API Error: ${errorMessage}`);
    }
};

const detectAppointmentIntent = async (message) => {
    const keywords = ["book", "appointment", "schedule", "visit", "checkup"];
    const hasKeyword = keywords.some(k => message.toLowerCase().includes(k));

    // If simple keyword match fails or is ambiguous, we could verify with LLM
    // For now, simple keyword match is robust enough for "intent detection" phase
    return hasKeyword;
};

module.exports = {
    generateResponse,
    detectAppointmentIntent
};
