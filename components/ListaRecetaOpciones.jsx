import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Colors from '../shared/Colors'
import Prompt from '../shared/Prompt'
import { GenerarIAReceta, GenerarImagenReceta } from '../services/AiModel'
import LoadingTexto from './LoadingTexto'

export default function ListaRecetaOpciones({ recetaOpcion }) {

    const [loading, setLoading] = useState(false)
    const onRecetaOpcionSelect = async (receta) => {
        setLoading(true);
        const PROMPT = "RecetaNombre: " + receta?.recetaNombre + " Descripcion:" + receta?.descripcion + Prompt.GENERAR_RECETA_COMPLETA_PROMPT;
        let parsedJSONResp;
        try {
            const result = await GenerarIAReceta(PROMPT);
            const extractJson = result.choices[0].message.content;
            console.log('String recibido de la IA:', extractJson);
            try {
                parsedJSONResp = JSON.parse(extractJson);
            } catch (parseErr) {
                console.log('Error al parsear JSON:', parseErr);
                setLoading(false);
                return;
            }
            console.log('Receta completa recibida:', parsedJSONResp);
            console.log('Campos de receta:', Object.keys(parsedJSONResp));
            // Generar imagen si imagePrompt existe y es string no vacío
            if (typeof parsedJSONResp.imagePrompt === 'string' && parsedJSONResp.imagePrompt.trim().length > 0) {
                console.log('Llamando a la API de imagen con prompt:', parsedJSONResp.imagePrompt);
                try {
                    const iaImageResp = await GenerarImagenReceta(parsedJSONResp.imagePrompt);
                    console.log('Respuesta de la API de imagen:', iaImageResp);
                    console.log('URL de imagen:', iaImageResp?.data?.image);
                } catch (imgErr) {
                    console.log('Error al generar imagen IA:', imgErr);
                }
            } else {
                console.log('No se encontró imagePrompt válido en la receta.');
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    }

    return (
        <View style={{
            marginTop: 20,
        }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold'
            }}>Selecciona una de las recetas</Text>
            <View>
                {recetaOpcion?.map((item, index) => (
                    <TouchableOpacity
                        onPress={() => onRecetaOpcionSelect(item)}
                        key={index} style={{
                            padding: 15,
                            borderWidth: 0.2,
                            borderRadius: 15,
                            marginTop: 15
                        }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}>{item?.recetaNombre}</Text>
                        <Text style={{
                            color: Colors.GRAY,
                        }}>{item?.descripcion}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <LoadingTexto loading={loading} />

        </View>
    )
}