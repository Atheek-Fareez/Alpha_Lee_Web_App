import Groq from 'groq-sdk';
import ChatHistory from '../Models/ChatHistory.js';
import User from '../Models/User.js';

export const getChatHistory = async (req, res) => {
    try {
        let history = await ChatHistory.findOne({ user: req.user.id });
        if (!history) {
            history = { messages: [] };
        }
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        // Initialize Groq SDK with GROQ_API_KEY_2 inside the function to ensure process.env is loaded
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_2 });

        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required." });

        const user = await User.findById(req.user.id).populate('unlockedPrograms');
        if (!user) return res.status(404).json({ message: "User not found." });

        let history = await ChatHistory.findOne({ user: req.user.id });
        if (!history) {
            history = new ChatHistory({ user: req.user.id, messages: [] });
        }

        const systemPrompt = {
            role: "system",
            content: `You are Alpha, an elite, AI-powered fitness coach and consultation assistant for Alpha Lee Fitness. 
Your primary objective is to assist users with their fitness journey, answer questions about training programs, and provide high-value, actionable advice based on science and high-performance protocols.
You should maintain a professional, motivating, and highly competent tone (think elite sports scientist meets disciplined coach). Keep responses concise unless detailed explanation is requested.

User Context:
- Name: ${user.firstName || 'User'} ${user.lastName || ''}
- Status: ${user.isemailverified ? "Verified Member" : "Unverified"}
- Unlocked Programs: ${user.unlockedPrograms && user.unlockedPrograms.length > 0 ? user.unlockedPrograms.map(p => p.title).join(', ') : 'None'}

CRITICAL INSTRUCTION:
If the user asks about meal plans, diets, nutrition, food tracking, or AI coaching, you MUST include the exact tag [REDIRECT_AICOACH] anywhere in your response. Briefly explain that you are a Consultation AI and that Alpha Lee Fitness has a dedicated AI Meal Planner, and suggest they use it.

Always address the user by their first name when appropriate.`
        };

        const formattedHistory = history.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const messagesForGroq = [
            systemPrompt,
            ...formattedHistory,
            { role: "user", content: message }
        ];

      const chatCompletion = await groq.chat.completions.create({
    messages: messagesForGroq,
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 1024,
});

        const aiResponse = chatCompletion.choices[0]?.message?.content;

        if (!aiResponse) {
            return res.status(500).json({ message: "AI failed to generate a response." });
        }

        history.messages.push({ role: "user", content: message });
        history.messages.push({ role: "assistant", content: aiResponse });

        await history.save();

        res.status(200).json({ 
            response: aiResponse,
            messages: history.messages 
        });

    } catch (error) {
        console.error("GROQ_CHAT_ERROR:", error);
        res.status(500).json({ message: "AI Consultation System Error: " + error.message });
    }
};

export const clearChatHistory = async (req, res) => {
    try {
        await ChatHistory.findOneAndDelete({ user: req.user.id });
        res.status(200).json({ message: "Chat history cleared." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
