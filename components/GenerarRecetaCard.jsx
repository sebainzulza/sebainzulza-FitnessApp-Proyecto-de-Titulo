import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { useRouter } from 'expo-router'

export default function GenerarRecetaCard() {
    const router=useRouter()
    return (
        <LinearGradient
            colors={[Colors.PRIMARY, Colors.DARKBLUE]}
            style={{
                marginTop: 15,
                padding: 15,
                borderRadius: 10
            }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors.WHITE,
                textAlign: 'center'
            }}>Quieres generar una receta con alimentos disponibles en tu despensa?</Text>

            <Text style={{
                color: Colors.WHITE,
                fontSize: 16,
                opacity: 0.8,
                marginTop: 7
            }}>Deja que la IA haga su magia... 👀🔮🍴</Text>

            <TouchableOpacity 
            onPress={()=>router.push('/generar-receta-IA')}
            style={{
                marginTop: 10,
                backgroundColor: Colors.WHITE,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                width: 190,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7
            }}>
                <Text style={{
                    fontSize: 18,
                    color: Colors.DARKBLUE
                }}>
                    Generar con IA
                </Text>
                <HugeiconsIcon icon={ArrowRight02Icon} color={Colors.DARKBLUE}/>
            </TouchableOpacity>

        </LinearGradient>
    )
}