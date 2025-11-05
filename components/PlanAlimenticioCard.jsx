import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import Colors from '../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SquareIcon, CheckmarkSquare02Icon } from '@hugeicons/core-free-icons';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { RefreshDataContext } from '../context/RefreshDataContext';

export default function PlanAlimenticioCard({ planAlimenticioInfo}) {

    const actualizarStatus = useMutation(api.PlanAlimenticio.actualizarStatus);
    const eliminarPlan = useMutation(api.PlanAlimenticio.EliminarPlanAlimenticio);
    const {refreshData, setRefreshData} = useContext(RefreshDataContext);
    
    const onCheck = async (status) => {
        const result = await actualizarStatus({
            id: planAlimenticioInfo?.planAlimenticio?._id,
            status: status,
            calorias:Number(planAlimenticioInfo?.receta?.jsonData?.calorias),
            proteinas: Number(planAlimenticioInfo?.receta?.jsonData?.proteinas),
            carbohidratos: Number(planAlimenticioInfo?.receta?.jsonData?.carbohidratos),
            grasas: Number(planAlimenticioInfo?.receta?.jsonData?.grasas),
        });

        Alert.alert('Genial!', 'Has actualizado el estado de la comida.')
        setRefreshData(Date.now());
    }

    const onPressCard = () => {
        Alert.alert(
            '¿Eliminar receta?',
            '¿Deseas eliminar esta receta de tu plan alimenticio diario?',
            [
                {
                    text: 'Mantener',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await eliminarPlan({
                                id: planAlimenticioInfo?.planAlimenticio?._id
                            });
                            setRefreshData(Date.now());
                            Alert.alert('Eliminado', 'La receta ha sido eliminada de tu plan');
                        } catch (error) {
                            console.error('Error al eliminar:', error);
                            Alert.alert('Error', 'No se pudo eliminar la receta');
                        }
                    }
                }
            ]
        );
    }

    return (
        <TouchableOpacity 
            onPress={onPressCard}
            style={{
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
                {planAlimenticioInfo?.planAlimenticio?.status !== true ?
                    <TouchableOpacity onPress={(e) => {
                        e.stopPropagation();
                        onCheck(true);
                    }}>
                        <HugeiconsIcon icon={SquareIcon} color={Colors.GRAY}/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={(e) => {
                        e.stopPropagation();
                        onCheck(false);
                    }}>
                        <HugeiconsIcon icon={CheckmarkSquare02Icon} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                }
            </View>
        </TouchableOpacity>
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