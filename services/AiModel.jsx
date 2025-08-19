// Replaced OpenAI Node SDK usage (not compatible with Expo/React Native bundler)
// with a fetch-based call to OpenRouter's REST endpoint. This runs in the
// client (Expo) and expects a public env variable EXPO_PUBLIC_OPENROUTER_API_KEY
// to be available at runtime. For production, consider proxying requests to a
// backend to keep the key private.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export const CrearPlanIA = async (PROMPT) => {
    const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY
    if (!API_KEY) {
        throw new Error('EXPO_PUBLIC_OPENROUTER_API_KEY no está definida. Añádela en app.json o usa un backend para la clave.')
    }

    const payload = {
        model: 'google/gemma-3n-e2b-it:free',
        messages: [{ role: 'user', content: PROMPT }],
        // Puedes añadir temperature, max_tokens, etc. si lo necesitas
    }

    const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
    })

    const text = await res.text()
    let json
    try {
        json = text ? JSON.parse(text) : null
    } catch (err) {
        throw new Error(`OpenRouter returned non-JSON response (status ${res.status}): ${text}`)
    }

    if (!res.ok) {
        const errDetail = json?.error || json || text
        throw new Error(`OpenRouter error ${res.status}: ${JSON.stringify(errDetail)}`)
    }

        // Extraer el contenido textual de la respuesta (compatibilidad con varios formatos)
        const RespIA = json?.choices?.[0]?.message?.content || json?.choices?.[0]?.text || json?.output?.[0]?.content || null

                if (RespIA && typeof RespIA === 'string') {
                    try {
                        const JSONContent = JSON.parse(RespIA.replace('```json', '').replace(/```/g, '').trim())
                        console.log(JSONContent)
                        return JSONContent
                    } catch (err) {
                        console.warn('No se pudo parsear JSON desde la respuesta IA:', err.message)
                    }
                }

                return json
}

// Nota: para desarrollo rápido puedes poner la clave temporalmente aquí:
// const API_KEY = 'tu_clave_aqui' (NO recomendado en producción)