require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not set in .env');
    process.exit(1);
}

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: "You are a helpful, knowledgeable data science and analytics assistant. Your expertise covers: data science, business intelligence, dashboards, Power BI, data mining, machine learning, SQL, Python, ETL, statistics, insurance analytics, risk modeling, data visualization, and data engineering.\n\nGuidelines:\n- Answer ONLY questions related to data, analytics, BI, or technology relevant to these fields.\n- If asked about anything outside these topics (sports, politics, food, entertainment, etc.), politely respond: \"I'm a data-focused assistant, so I can only help with questions about data science, analytics, BI, and related topics. Is there something data-related I can assist you with?\"\n- Keep responses educational, clear, and structured. Use bullet points or numbered lists when helpful.\n- Be concise but thorough — aim for 2-4 paragraphs or a well-structured list.\n- Use markdown-like formatting: **bold** for emphasis, `code` for technical terms, and bullet points for lists.\n- If you don't know something, be honest and suggest where the user might find the answer."
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.6,
                max_tokens: 900
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: err.error?.message || 'API error' });
        }

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (err) {
        console.error('Groq API error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});