// config/ai.js
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Gemini-style function banate hain
const generateContent = async (params) => {
  // Convert Gemini contents to Groq messages
  const messages = [];
  const { contents, config } = params;

  // System instruction
  if (config?.systemInstruction) {
    messages.push({
      role: 'system',
      content: config.systemInstruction,
    });
  }

  // Convert contents array
  if (Array.isArray(contents)) {
    for (const msg of contents) {
      let role = 'user';
      if (msg.role === 'model') role = 'assistant';
      else if (msg.role === 'user') role = 'user';
      const content = msg.parts?.[0]?.text || '';
      messages.push({ role, content });
    }
  } else if (typeof contents === 'string') {
    messages.push({ role: 'user', content: contents });
  }

  // Temperature
  const temperature = config?.temperature ?? 0.5;

  // Groq model – best for code: mixtral or llama3
 const completion = await groq.chat.completions.create({
  messages,
  model: 'llama-3.3-70b-versatile',   // or 'llama-3.1-8b-instant' / 'gemma2-9b-it'
  temperature,
});
  return {
    text: completion.choices[0].message.content,
  };
};

module.exports = {
  models: {
    generateContent,
  },
};