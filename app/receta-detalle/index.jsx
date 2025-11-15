import { View, Platform, FlatList, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import IntroduccionReceta from '../../components/IntroduccionReceta'
import Colors from '../../shared/Colors'
import RecetaIngredientes from '../../components/RecetaIngredientes'
import RecetaPasos from '../../components/RecetaPasos'
import Button from '../../components/shared/Button'
import ActionSheet from 'react-native-actions-sheet'
import AnadirAlPlanActionSheet from '../../components/AnadirAlPlanActionSheet'

export default function DetalleReceta() {
    const { recetaId } = useLocalSearchParams()
    const router = useRouter()
    const actionSheetRef = useRef(null)
    const [eliminando, setEliminando] = useState(false)
    const recetaDetalle = useQuery(api.Recetas.GetRecetaById, {
        id: recetaId || 'jd7fcm1q71t1bgskj8nvsdt6z97ptgfq'
    })
    const eliminarReceta = useMutation(api.Recetas.EliminarReceta)

    const handleEliminarReceta = () => {
        Alert.alert(
            '¿Eliminar receta?',
            '¿Estás seguro de que deseas eliminar esta receta? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setEliminando(true)
                            await eliminarReceta({ id: recetaId })
                            Alert.alert('¡Eliminado!', 'La receta ha sido eliminada', [
                                {
                                    text: 'OK',
                                    onPress: () => router.back()
                                }
                            ])
                        } catch (error) {
                            setEliminando(false)
                            Alert.alert('Error', 'No se pudo eliminar la receta')
                        }
                    }
                }
            ]
        )
    }

    return (
        <FlatList
            data={[]}
            renderItem={() => null}
            ListHeaderComponent={
                <View style={{
                    padding: 20,
                    paddingTop: Platform.OS == 'ios' ? 40 : 30,
                    backgroundColor: Colors.WHITE,
                    minHeight: '100%'
                }}>
                    <IntroduccionReceta recetaDetalle={recetaDetalle} />

                    <View style={{ backgroundColor: '#FFF8E1', borderRadius: 8, padding: 10, marginVertical: 10 }}>
                        <Text style={{ color: '#6b6b6b', fontSize: 12 }}>
                            Los contenidos generados por IA son orientativos y no sustituyen consejo profesional.
                        </Text>
                    </View>

                    <RecetaIngredientes recetaDetalle={recetaDetalle} />
                    <RecetaPasos recetaDetalle={recetaDetalle} />
                    
                    {/* Botones de acción */}
                    <View style={{ gap: 10, marginTop: 10 }}>
                        <Button title={'Añadir al plan'}
                            onPress={() => actionSheetRef.current && actionSheetRef.current.show()} />
                        
                        <TouchableOpacity
                            onPress={handleEliminarReceta}
                            disabled={eliminando}
                            style={{
                                backgroundColor: eliminando ? '#FFCDD2' : '#FFEBEE',
                                padding: 15,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                borderWidth: 1,
                                borderColor: '#FFCDD2'
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>🗑️</Text>
                            <Text style={{
                                color: '#D32F2F',
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}>
                                {eliminando ? 'Eliminando...' : 'Eliminar Receta'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ActionSheet ref={actionSheetRef}>
                        <AnadirAlPlanActionSheet recetaDetalle={recetaDetalle}
                            hideActionSheet={() => actionSheetRef.current && actionSheetRef.current.hide()} />
                    </ActionSheet>
                </View>
            }
        />
    )
}