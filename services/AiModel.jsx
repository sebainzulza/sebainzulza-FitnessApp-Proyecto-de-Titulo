import axios from "axios";

// Función base para llamar a la IA
const callOpenRouterAI = async ({ PROMPT, model = 'google/gemma-3n-e2b-it:free', response_format }) => {
    const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
    if (!API_KEY) {
        throw new Error('EXPO_PUBLIC_OPENROUTER_API_KEY no está definida. Añádela en app.json o usa un backend para la clave.');
    }

    const payload = {
        model,
        messages: [{ role: 'user', content: PROMPT }],
        ...(response_format ? { response_format } : {})
    };

    const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json;
    try {
        json = text ? JSON.parse(text) : null;
    } catch (err) {
        throw new Error(`OpenRouter returned non-JSON response (status ${res.status}): ${text}`);
    }

    if (!res.ok) {
        const errDetail = json?.error || json || text;
        throw new Error(`OpenRouter error ${res.status}: ${JSON.stringify(errDetail)}`);
    }

    const RespIA = json?.choices?.[0]?.message?.content || json?.choices?.[0]?.text || json?.output?.[0]?.content || null;

    if (RespIA && typeof RespIA === 'string') {
        try {
            const JSONContent = JSON.parse(RespIA.replace('```json', '').replace(/```/g, '').trim());
            console.log(JSONContent);
            return JSONContent;
        } catch (err) {
            console.warn('No se pudo parsear JSON desde la respuesta IA:', err.message);
        }
    }
    return json;
};

// Genera opciones de recetas usando IA
export const GenerarIAReceta = async (PROMPT) => {
    return await callOpenRouterAI({ PROMPT, response_format: 'json_object' });
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export const CrearPlanIA = async (PROMPT) => {
    return await callOpenRouterAI({ PROMPT });
};
