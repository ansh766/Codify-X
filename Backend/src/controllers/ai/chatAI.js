const ai = require("../../config/ai");
const createSystemInstructionWithContext = require("../../utils/createSystemInstructionWithContext");

// Rate limiting store
const userRequests = new Map();

const chatAI = async (req, res) => {
    try {
        const { problemDetails, userSolution, chatHistory } = req.body;
        const { username } = req.payload;

        if (!(problemDetails && userSolution && chatHistory)) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // Rate limiting
        const now = Date.now();
        const lastRequest = userRequests.get(username) || 0;
        if (now - lastRequest < 3000) {
            return res.status(429).send({ 
                error: "Please wait 3 seconds before sending another message" 
            });
        }
        userRequests.set(username, now);

        // API call with retry
        let response;
        let lastError;
        
        for (let i = 0; i < 3; i++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.0-flash-lite",
                    contents: chatHistory,
                    config: {
                        systemInstruction: createSystemInstructionWithContext(username, problemDetails, userSolution),
                    },
                });
                break;
            } catch (err) {
                lastError = err;
                console.log(`Attempt ${i + 1} failed:`, err.message);
                if (err.message.includes('quota') || err.message.includes('exhausted')) {
                    break;
                }
                if (i < 2) await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        if (!response) {
            throw lastError || new Error("All attempts failed");
        }

        res.status(201).send(response.text);

    } catch (error) {
        console.error("Chat AI Error:", error.message);
        
        if (error.message.includes('quota') || error.message.includes('exhausted')) {
            return res.status(429).send({ 
                error: "API quota exhausted. Please try again later." 
            });
        }
        
        res.status(500).send({ error: error.message });
    }
};

module.exports = chatAI;