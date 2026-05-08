const ai = require("../../config/ai");
const createComplexityAnalysisPrompt = require("../../utils/createComplexityAnalysisPrompt");
const { extractJSONFromCodeBlock } = require("../../utils/utils");

// Rate limiting store
const userRequests = new Map();

const getComplexitiesFromAI = async (req, res) => {
    try {
        const { userCode } = req.body;
        const { username } = req.payload;

        if (!userCode) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // Rate limiting
        const now = Date.now();
        const lastRequest = userRequests.get(username) || 0;
        if (now - lastRequest < 3000) {
            return res.status(429).send({ 
                error: "Please wait 3 seconds before analyzing another code" 
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
                    contents: createComplexityAnalysisPrompt(userCode),
                    config: {
                        temperature: 0.0,
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

        // Parse JSON response
        let complexityData;
        const extractedJSON = extractJSONFromCodeBlock(response.text);
        
        if (extractedJSON) {
            complexityData = JSON.parse(extractedJSON);
        } else {
            complexityData = JSON.parse(response.text);
        }

        res.status(201).json(complexityData);

    } catch (error) {
        console.error("Complexity Analysis Error:", error.message);
        
        if (error.message.includes('quota') || error.message.includes('exhausted')) {
            return res.status(429).send({ 
                error: "API quota exhausted. Please try again later." 
            });
        }
        
        res.status(500).send({ error: error.message });
    }
};

module.exports = getComplexitiesFromAI;