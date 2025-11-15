import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../shared/Colors'
import { traducirTexto } from '../shared/Translations'

const PARTES_DEL_CUERPO = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs', 
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
]

export default function ParteCuerpoSelector({ parteSeleccionada, onParteSeleccionada }) {
    const parteActual = parteSeleccionada || 'back'
    
    const handleSeleccion = (parte) => {
        if (typeof onParteSeleccionada === 'function') {
            onParteSeleccionada(parte)
        }
    }

    if (!Array.isArray(PARTES_DEL_CUERPO) || PARTES_DEL_CUERPO.length === 0) {
        return null
    }

    return (
        <View style={{ marginVertical: 15 }}>
            <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: Colors?.DARKBLUE || '#00008B',
                marginBottom: 10,
                paddingHorizontal: 5
            }}>
                Selecciona una parte del cuerpo:
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {PARTES_DEL_CUERPO.map((parte, index) => {
                    if (!parte) return null
                    
                    const esSeleccionado = parteActual === parte
                    
                    return (
                        <TouchableOpacity
                            key={`parte-${parte}-${index}`}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                backgroundColor: esSeleccionado ? (Colors?.PRIMARY || '#3498DB') : (Colors?.SECONDARY || '#fbf5ff'),
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: Colors?.PRIMARY || '#3498DB',
                                marginBottom: 8,
                                marginRight: 8
                            }}
                            onPress={() => handleSeleccion(parte)}
                        >
                            <Text style={{
                                fontSize: 14,
                                color: esSeleccionado ? (Colors?.WHITE || '#FFFFFF') : (Colors?.PRIMARY || '#3498DB'),
                                fontWeight: '500'
                            }}>
                                {traducirTexto(parte)}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}
