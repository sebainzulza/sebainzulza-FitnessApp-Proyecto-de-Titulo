import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../shared/Colors'
import { traducirTexto } from '../shared/Translations'

// Lista completa de partes del cuerpo disponibles
const PARTES_DEL_CUERPO = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs', 
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
];

export default function ParteCuerpoSelector({ parteSeleccionada, onParteSeleccionada }) {
    // Validar que parteSeleccionada no sea undefined
    const parteActual = parteSeleccionada || 'back'
    
    // Validar que onParteSeleccionada sea una función
    const handleSeleccion = (parte) => {
        if (typeof onParteSeleccionada === 'function') {
            onParteSeleccionada(parte)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Selecciona una parte del cuerpo:</Text>
            
            <View style={styles.botonesContainer}>
                {PARTES_DEL_CUERPO.map((parte, index) => (
                    <TouchableOpacity
                        key={parte}
                        style={[
                            styles.boton,
                            parteActual === parte && styles.botonSeleccionado
                        ]}
                        onPress={() => handleSeleccion(parte)}
                    >
                        <Text style={[
                            styles.textoBoton,
                            parteActual === parte && styles.textoSeleccionado
                        ]}>
                            {traducirTexto(parte)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.DARKBLUE,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    botonesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    boton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        marginBottom: 8,
    },
    botonSeleccionado: {
        backgroundColor: Colors.PRIMARY,
    },
    textoBoton: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontWeight: '500',
    },
    textoSeleccionado: {
        color: Colors.WHITE,
    }
})
