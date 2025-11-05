import { View, Platform, FlatList, Text } from 'react-native'
import React, { useRef } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import IntroduccionReceta from '../../components/IntroduccionReceta'
import Colors from '../../shared/Colors'
import RecetaIngredientes from '../../components/RecetaIngredientes'
import RecetaPasos from '../../components/RecetaPasos'
import Button from '../../components/shared/Button'
import ActionSheet from 'react-native-actions-sheet'
import AnadirAlPlanActionSheet from '../../components/AnadirAlPlanActionSheet'

export default function DetalleReceta() {
    const { recetaId } = useLocalSearchParams()
    const actionSheetRef = useRef(null)
    const recetaDetalle = useQuery(api.Recetas.GetRecetaById, {
        id: recetaId || 'jd7fcm1q71t1bgskj8nvsdt6z97ptgfq'
    })

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
                    <View>
                        <Button title={'Añadir al plan'}
                            onPress={() => actionSheetRef.current && actionSheetRef.current.show()} />
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