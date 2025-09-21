
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import Colors from '../shared/Colors'
import Prompt from '../shared/Prompt'
import { GenerarIAReceta } from '../services/AiModel'
import LoadingTexto from './LoadingTexto'
import { useRouter } from 'expo-router'
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { UserContext } from '../context/UserContext'


export default function ListaRecetaOpciones({ recetaOpcion }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const crearReceta = useMutation(api.Recetas.CrearNuevaReceta);
    const { user } = useContext(UserContext);

    const onRecetaOpcionSelect = async (receta) => {
        setLoading(true)
        const PROMPT = "RecetaNombre: " + receta?.recetaNombre + " Descripcion:" + receta?.descripcion + Prompt.GENERAR_RECETA_COMPLETA_PROMPT
        try {
            const result = await GenerarIAReceta(PROMPT);
            // Guardar la receta en Convex antes de navegar
            if (!user?._id) {
                alert('Usuario no identificado.');
                setLoading(false);
                return;
            }
            const recetaId = await crearReceta({
                jsonData: result,
                uid: user._id,
                recetaNombre: result.recetaNombre || receta?.recetaNombre || 'Receta IA'
            });
            // Navegar a la pantalla de detalle pasando el id de la receta
            router.push({
                pathname: '/receta-detalle',
                params: { recetaId }
            });
        } catch (e) {
            console.log('Error al generar o guardar receta IA:', e);
        } finally {
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