import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '../shared/Colors'
import Prompt from '../shared/Prompt'
import { GenerarIAReceta, GenerarImagenReceta } from '../services/AiModel'
import LoadingTexto from './LoadingTexto'
import { useMutation } from 'convex/react'
import { api } from './../convex/_generated/api'
import { UserContext } from './../context/UserContext'
import { useRouter } from 'expo-router'

export default function ListaRecetaOpciones({ recetaOpcion }) {

    const [loading, setLoading] = useState(false)
    const CrearNuevaReceta = useMutation(api.Recetas.CrearNuevaReceta);
    const { user } = useContext(UserContext);
    const router = useRouter();
    const onRecetaOpcionSelect = async (receta) => {
        setLoading(true);
        const PROMPT = "RecetaNombre: " + receta?.recetaNombre + " Descripcion:" + receta?.descripcion + Prompt.GENERAR_RECETA_COMPLETA_PROMPT;
        let parsedJSONResp;
        try {
            const result = await GenerarIAReceta(PROMPT);
            const extractJson = result.choices[0].message.content;
            
            // Parsear JSON (con limpieza automática)
            const parsedJSONResp = JSON.parse(extractJson.replace(/```json\n?/g, '').replace(/```/g, '').trim());
            
            // Mostrar toda la información de la receta
            console.log('Receta completa:', parsedJSONResp);
            
            // Generar imagen si existe imagePrompt
            let imageURL = null;
            if (typeof parsedJSONResp.imagePrompt === 'string' && parsedJSONResp.imagePrompt.trim().length > 0) {
                try {
                    const iaImageResp = await GenerarImagenReceta(parsedJSONResp.imagePrompt);
                    imageURL = iaImageResp?.data?.image;
                    console.log('✅ Imagen generada:', imageURL);
                } catch (imgErr) {
                    console.log('Error al generar imagen:', imgErr);
                }
            }


            // Guardar en base de datos
            let guardarRecetaResultado = null;
            try {
                guardarRecetaResultado = await CrearNuevaReceta({
                    jsonData: parsedJSONResp,
                    imagenUrl: imageURL,
                    recetaNombre: parsedJSONResp?.recetaNombre,
                    uid: user?._id
                });
                console.log('✅ Receta guardada:', guardarRecetaResultado);
                
                // Redirigir a la pantalla de detalle
                if (guardarRecetaResultado) {
                    router.push({
                        pathname: '/receta-detalle',
                        params: { recetaId: guardarRecetaResultado }
                    });
                }
            } catch (dbErr) {
                console.log('❌ Error al guardar en BD:', dbErr);
            }

            setLoading(false);
        } catch (e) {
            console.log('❌ Error al generar receta:', e);
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