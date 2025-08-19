export default {
    // PROMPT_PLAN: pide únicamente un JSON válido con valores numéricos.
    // Respuesta estricta: solo el objeto JSON, sin texto adicional ni explicaciones.
    PROMPT_PLAN: `Usa la edad = 28 años y, basándote en el peso, altura, género, objetivo y días de entrenamiento por semana, calcula y devuelve SÓLO un objeto JSON válido que siga exactamente este esquema (sin unidades, sólo números):
{
    "calorias": <number>,
    "proteinas": <number>,
    "carbohidratos": <number>,
    "grasas": <number>
}

Responde únicamente con el JSON puro y nada más. No añadas explicaciones, ni formato markdown, ni comentarios. Asegúrate de que los valores sean números (enteros preferiblemente).`,
}