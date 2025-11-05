const Prompt = {
    // PROMPT_PLAN: pide únicamente un JSON válido con valores numéricos.
    // Respuesta estricta: solo el objeto JSON, sin texto adicional ni explicaciones.
    PROMPT_PLAN: [
        'Basándote en el peso, altura, género, objetivo, edad y días de entrenamiento por semana, calcula y devuelve SÓLO un objeto JSON válido que siga exactamente este esquema (sin unidades, sólo números):',
        '{',
        '    "calorias": <number>,',
        '    "proteinas": <number>,',
        '    "carbohidratos": <number>,',
        '    "grasas": <number>',
        '}',
        '',
        'Responde únicamente con el JSON puro y nada más. No añadas explicaciones, ni formato markdown, ni comentarios. Asegúrate de que los valores sean números (enteros preferiblemente).'
    ].join('\n'),

    GENERAR_RECETA_OPCION_PROMPT: 'Dependiendo de las instrucciones del usuario, genera 3 variantes de nombre de receta con un emoji relacionado, descripcion de 2 lineas y una lista de ingredientes principales IMPORTANTE QUE SEA EN FORMATO JSON con los campos recetaNombre,descripcion,ingredientes(sin tamaño) solamente. No me des texto de respuesta',

    GENERAR_RECETA_COMPLETA_PROMPT: [
        '- Según el nombre y la descripción de la receta, genera los campos "recetaNombre" y "descripcion".',
        '- Dame la lista completa de ingredientes como "ingredientes", incluyendo:',
        '    - "icon" (emoji representativo)',
        '    - "ingrediente" (nombre del ingrediente)',
        '    - "cantidad" (cantidad necesaria).',
        '- Incluye los pasos detallados de la receta como "pasos".',
        '- Muestra el total de calorías como "calorias" (solo número).',
        '- Indica el tiempo de preparación en minutos como "tiempoPreparacion".',
        '- Indica el número de personas a servir como "servirA".',
        '- Devuélveme también una categoría de la receta desde la lista: [Desayuno, Almuerzo, Cena, Snack, Postre].',
        '- Dame la respuesta únicamente en formato JSON.',
        '- El esquema del formato debe ser:',
        '',
        '{',
        '"descripcion": "string",',
        '"recetaNombre": "string",',
        '"calorias": "number",',
        '"proteinas": "number",',
        '"carbohidratos": "number",',
        '"grasas": "number",',
        '"categoria": ["string"],',
        '"tiempoPreparacion": "number",',
        '"ingredientes": [',
        '    {',
        '    "icon": "string",',
        '    "ingrediente": "string",',
        '    "cantidad": "string"',
        '    }',
        '],',
        '"servirA": "number",',
        '"pasos": ["string"]',
        '}',
    ].join('\n'),
};

export default Prompt;