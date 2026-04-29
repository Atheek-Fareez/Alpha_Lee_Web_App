import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
import Groq from "groq-sdk"; // 1. Change import to Groq

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getFitnessPrediction = async (req, res) => {
    const { current_w, target_w, duration, workout_type } = req.body;
    
    // Path to your Python script
    const scriptPath = path.join(__dirname, '..', 'AI_Component', 'predict.py');
    const pythonExecutable = path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe');

    const pythonProcess = spawn(pythonExecutable, [scriptPath, current_w, target_w, duration, workout_type]);

    let resultData = '';
    pythonProcess.stdout.on('data', (data) => { resultData += data.toString(); });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) return res.status(500).json({ success: false, message: "Python failed" });

        const [goal, dailyOffset, workoutBurn] = resultData.trim().split(',');
        
        // Calculate target: Base 2000 - offset (if loss) or + offset (if gain) + workout burn
        let finalTarget;
        const offset = parseFloat(dailyOffset);
        const burn = parseFloat(workoutBurn);
        
        if (goal === "Loss") {
            finalTarget = (2000 - offset + burn).toFixed(2);
        } else if (goal === "Gain") {
            finalTarget = (2000 + offset + burn).toFixed(2);
        } else {
            finalTarget = (2000 + burn).toFixed(2);
        }

        try {
            // 3. ASK GROQ (Using Llama 3.3 for high quality)
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an Expert AI Fitness Coach. Your goal is to provide a DETAILED and USER-FRIENDLY nutrition protocol.
                        
                        PLAN ARCHITECTURE (STRICT):
                        1. 📊 Nutrition Blueprint: (Explain the overall strategy, goal, and why these calories were chosen).
                        2. 🥗 The Daily Protocol:
                           - Breakfast
                           - Lunch
                           - Dinner
                           - Snacks
                        3. 🛒 Quick Shopping List: (List the core items needed for this plan).
                        4. 💧 Hydration & Recovery: (Specific simple tips for water and sleep).
                        5. 📈 Results Forecast: (Estimated timeline for seeing changes).
                        
                        FOOD FORMAT:
                        - List each food in ONE LINE: Food Name (Amount) → Calories, Protein
                        - EGGS: Use quantity (e.g., 4 eggs).
                        - OTHERS: Use grams (g).
                        - Include a tiny 3-word prep tip next to items (e.g., "Boiled or scrambled").
                        
                        HEALTHY REASON:
                        - After every category, add: 👉 Healthy Reason: (A detailed but simple explanation of how this meal helps the body).
                        
                        RULES:
                        - Use very simple English but be very descriptive and detailed.
                        - Use Markdown headers, bold text, and bullet points for high readability.
                        - Keep it clean, professional, and friendly.`
                    },
                    {
                        role: "user",
                        content: `User Goal: ${goal}. 
                        Daily Target: ${finalTarget} kcal. 
                        Burned: ${workoutBurn} kcal in ${workout_type}.
                        
                        Generate a DETAILED and FRIENDLY plan using the structure above.`
                    }
                ],
                model: "llama-3.3-70b-versatile",
            });

            const mealPlanText = chatCompletion.choices[0]?.message?.content || "";

            res.json({
                success: true,
                data: {
                    goal,
                    dailyCalorieTarget: finalTarget,
                    gymWorkoutBurn: workoutBurn,
                    mealPlan: mealPlanText,
                    message: `Success! Plan created using Llama 3.3.`
                }
            });

        } catch (error) {
            console.error("Groq Error:", error);
            res.status(500).json({ success: false, message: "AI Coach is resting. Try again later." });
        }
    });
};

export const chatWithCoach = async (req, res) => {
    const { message, history, activePlan } = req.body;

    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a Friendly and Detailed AI Fitness Coach.
                    
                    CONTEXT:
                    Active Plan: ${activePlan || "None."}
                    
                    RULES:
                    - Be detailed and helpful.
                    - Use simple English.
                    - Always refer back to the Active Plan.
                    - If suggesting changes, give the full food format: Food (Amount) → Calories, Protein.
                    - Include "👉 Healthy Reason" for your suggestions.
                    - Ask about their training and feeling to give better advice.`
                },
                ...history,
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const reply = chatCompletion.choices[0]?.message?.content || "";
        res.json({ success: true, reply });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, message: "Coach is temporarily unavailable." });
    }
};