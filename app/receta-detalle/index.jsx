import { View, Text, Platform } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useLocalSearchParams } from 'expo-router/build/hooks';
import IntroduccionReceta from '../../components/IntroduccionReceta';
import Colors from '../../shared/Colors';

export default function DetalleReceta(){
    const {recetaId} = useLocalSearchParams();
    console.log(recetaId);
    const recetaDetalle = useQuery(api.Recetas.GetRecetaById, {
        id: recetaId || 'jd7fcm1q71t1bgskj8nvsdt6z97ptgfq'
    });

    console.log("recetaDetalle:", recetaDetalle);

    return (
        <View style={{
            padding: 20,
            paddingTop: Platform.OS == 'ios' ? 40 : 30,
            backgroundColor: Colors.WHITE,
            height: '100%'
          }}>
            <IntroduccionReceta recetaDetalle={recetaDetalle}/>
        </View>
    )
}