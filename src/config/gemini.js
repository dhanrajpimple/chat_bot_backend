const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

module.exports = model;
