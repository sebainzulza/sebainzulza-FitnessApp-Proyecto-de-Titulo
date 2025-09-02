import axios from "axios";

// Función base para llamar a la IA
const callOpenRouterAI = async ({ PROMPT, model = 'google/gemma-3n-e2b-it:free', response_format }) => {
    const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
    if (!API_KEY) {
        throw new Error('EXPO_PUBLIC_OPENROUTER_API_KEY no está definida.');
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

const BASE_URL='https://aigurulab.tech';
export const GenerarImagenReceta=async(prompt) => await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: prompt,
            model: 'sdxl',
            aspectRatio:"1:1"
        },
        {
            headers: {
                'x-api-key': process.env.EXPO_PUBLIC_AIGURU_LAB_API_KEY,
                'Content-Type': 'application/json',
            },
        })