import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Clock01Icon, FireIcon } from '@hugeicons/core-free-icons';
import Colors from '../shared/Colors';
import { Link } from 'expo-router';

export default function RecetasCard({ receta }) {
    const recetaJson = receta?.jsonData;
    return (

        <View style={{
            flex: 1,
            margin: 5
        }}>
            <Link href={'/receta-detalle?recetaId=' + receta?._id}>
                <View style={{
                    padding: 10,
                    backgroundColor: Colors.WHITE,
                    borderRadius: 15
                    
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>{receta?.recetaNombre}</Text>

                    <View style={[styles.infoContainer, { gap: 15, marginTop: 6 }]}>
                        <View style={styles.infoContainer}>
                            <HugeiconsIcon icon={FireIcon} color={Colors.RED} />
                            <Text style={{
                                fontSize: 14,
                                color: Colors.GRAY
                            }}>{recetaJson?.calorias} kCal</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <HugeiconsIcon icon={Clock01Icon} color={Colors.RED} />
                            <Text style={{
                                fontSize: 14,
                                color: Colors.GRAY
                            }}>{recetaJson?.tiempoPreparacion} Min</Text>
                        </View>
                    </View>
                </View>
            </Link>
        </View>

    )
}

const styles = StyleSheet.create({
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center'
    }
})