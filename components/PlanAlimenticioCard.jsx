import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import Colors from '../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SquareIcon, CheckmarkSquare02Icon } from '@hugeicons/core-free-icons';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function PlanAlimenticioCard({ planAlimenticioInfo , refreshData}) {

    const actualizarStatus = useMutation(api.PlanAlimenticio.actualizarStatus);

    const onCheck = async (status) => {
        const result = await actualizarStatus({
            id: planAlimenticioInfo?.planAlimenticio?._id,
            status: status
        });

        Alert.alert('Genial!', 'Has actualizado el estado de la comida.')
        refreshData()
    }

    return (
        <View style={{
            padding: 10,
            backgroundColor: Colors.WHITE,
            borderRadius: 15,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.tipoComidaText}>{planAlimenticioInfo?.planAlimenticio?.comidaTipo}</Text>
                <Text style={styles.recetaNombreText}>{planAlimenticioInfo?.receta?.recetaNombre}</Text>
                <Text>{planAlimenticioInfo?.receta?.jsonData?.calorias} kcal</Text>
                <Text>{planAlimenticioInfo?.receta?.jsonData?.proteinas} grs proteína</Text>
                <Text>{planAlimenticioInfo?.receta?.jsonData?.carbohidratos} grs carbohidratos</Text>
                <Text>{planAlimenticioInfo?.receta?.jsonData?.grasas} grs grasas</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                {planAlimenticioInfo?.planAlimenticio?.status != true ?
                    <TouchableOpacity onPress={() => onCheck(true)}>
                        <HugeiconsIcon icon={SquareIcon} color={Colors.GRAY}/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => onCheck(false)}>
                        <HugeiconsIcon icon={CheckmarkSquare02Icon} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tipoComidaText: {
        backgroundColor: Colors.SECONDARY,
        color: Colors.PRIMARY,
        padding: 1,
        paddingHorizontal: 10,
        borderRadius: 99,
        flexWrap: 'wrap',
    },
    recetaNombreText: {
        fontSize: 18,
        fontWeight: 'bold'
    },

})