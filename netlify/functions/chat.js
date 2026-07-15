// netlify/functions/chat.js
//
// Serverless endpoint behind /api/chat (see netlify.toml redirect).
// 1. Sends the visitor's message to Groq (llama-3.3-70b-versatile) with a
//    system prompt describing the UAB-IARDT project.
// 2. Logs the (message, reply) pair to Supabase for later review.
// 3. Never exposes GROQ_API_KEY or SUPABASE_SERVICE_ROLE_KEY to the browser —
//    both are read from Netlify environment variables at runtime only.

const Groq = require('groq-sdk');
const { createClient } = require('@supabase/supabase-js');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SYSTEM_PROMPT = `You are the AI assistant embedded on Globatech's UAB-IARDT insurance analytics case study site.
You can explain: the ETL pipeline (Python/SQLAlchemy/pandas, SQL Server warehouse, star schema with
DIM_DATE, DIM_CLIENT, DIM_BRANCHE, DIM_PAYMENT_TYPE, FACT_SINISTRES, FACT_PAYMENTS), the Power BI
dashboard (loss ratio, claims volume, DAX measures), and the three XGBoost models (a claim-severity
regressor with R² 0.936, a claim-likelihood classifier flagged for possible data leakage, and a
collections time-series forecaster that is currently unreliable). Answer clearly and concisely for a
technical audience (recruiters, engineers). If asked something unrelated to this project, politely
redirect back to what the project covers.`;

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let message, sessionId;
  try {
    ({ message, sessionId } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Missing "message"' }) };
  }
  if (message.length > 2000) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Message too long' }) };
  }

  let reply;
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.4,
      max_tokens: 600
    });
    reply = completion.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty completion from Groq');
  } catch (err) {
    console.error('Groq error:', err.message);
    return { statusCode: 502, headers: HEADERS, body: JSON.stringify({ error: 'The assistant is temporarily unavailable. Please try again shortly.' }) };
  }

  // Log the turn. A logging failure should never break the chat reply for the visitor.
  try {
    const { error } = await supabase.from('chat_logs').insert({
      session_id: sessionId || 'unknown',
      user_message: message,
      bot_reply: reply
    });
    if (error) console.error('Supabase insert error:', error.message);
  } catch (err) {
    console.error('Supabase logging exception:', err.message);
  }

  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ reply }) };
};