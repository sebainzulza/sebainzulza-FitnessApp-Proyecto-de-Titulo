import { View, Text, TextInput, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import Colors from '../../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { useRutina } from '../../context/RutinaContext'

export default function CrearRutina() {
    const router = useRouter()
    const { actualizarRutina, limpiarRutina } = useRutina()
    const [nombreRutina, setNombreRutina] = useState('')
    const [objetivo, setObjetivo] = useState('')
    const [notas, setNotas] = useState('')

    const objetivos = [
        'Fuerza',
        'Hipertrofia',
        'Resistencia',
        'Pérdida de peso',
        'Tonificación',
        'Acondicionamiento'
    ]

    const handleContinuar = () => {
        if (!nombreRutina.trim()) {
            Alert.alert('Error', 'Debes ingresar un nombre para la rutina')
            return
        }
        if (!objetivo) {
            Alert.alert('Error', 'Debes seleccionar un objetivo')
            return
        }

        // Pasar datos directamente como parámetros
        const datosRutina = {
            nombreRutina: nombreRutina.trim(),
            objetivo: objetivo,
            notas: notas.trim()
        }
        
        console.log('✅ Navegando con datos:', datosRutina)
        
        // Navegar pasando los datos como JSON string
        router.push({
            pathname: '/rutinas/seleccionar-ejercicios',
            params: {
                datosRutina: JSON.stringify(datosRutina)
            }
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <View style={{
                padding: 20,
                paddingTop: Platform.OS === 'ios' ? 50 : 40,
                backgroundColor: Colors.WHITE,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
            }}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ marginBottom: 15 }}
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={Colors.DARKBLUE} />
                </TouchableOpacity>
                
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                    Crear Nueva Rutina
                </Text>
                <Text style={{ fontSize: 16, color: Colors.GRAY, marginTop: 5 }}>
                    Paso 1 de 3: Información básica
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 15
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.DARKBLUE,
                        marginBottom: 10
                    }}>
                        Nombre de la rutina *
                    </Text>
                    <TextInput
                        value={nombreRutina}
                        onChangeText={setNombreRutina}
                        placeholder="Ej: Rutina Pierna Lunes"
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.GRAY,
                            borderRadius: 10,
                            padding: 15,
                            fontSize: 16,
                            backgroundColor: '#F9F9F9'
                        }}
                        maxLength={50}
                        autoCapitalize="sentences"
                    />
                    <Text style={{ 
                        color: Colors.GRAY, 
                        fontSize: 12, 
                        marginTop: 5,
                        textAlign: 'right'
                    }}>
                        {nombreRutina.length}/50
                    </Text>
                </View>

                <View style={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 15
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.DARKBLUE,
                        marginBottom: 10
                    }}>
                        Objetivo *
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {objetivos.map((obj) => (
                            <TouchableOpacity
                                key={obj}
                                onPress={() => setObjetivo(obj)}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: objetivo === obj ? Colors.PRIMARY : Colors.GRAY,
                                    backgroundColor: objetivo === obj ? Colors.SECONDARY : Colors.WHITE,
                                    marginRight: 10,
                                    marginBottom: 10
                                }}
                            >
                                <Text style={{
                                    color: objetivo === obj ? Colors.PRIMARY : Colors.GRAY,
                                    fontWeight: objetivo === obj ? 'bold' : 'normal'
                                }}>
                                    {obj}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 20
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.DARKBLUE,
                        marginBottom: 10
                    }}>
                        Notas (Opcional)
                    </Text>
                    <TextInput
                        value={notas}
                        onChangeText={setNotas}
                        placeholder="Añade notas o detalles sobre esta rutina..."
                        multiline={true}
                        numberOfLines={4}
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.GRAY,
                            borderRadius: 10,
                            padding: 15,
                            fontSize: 16,
                            backgroundColor: '#F9F9F9',
                            textAlignVertical: 'top',
                            height: 100
                        }}
                        maxLength={200}
                        autoCapitalize="sentences"
                    />
                    <Text style={{ 
                        color: Colors.GRAY, 
                        fontSize: 12, 
                        marginTop: 5,
                        textAlign: 'right'
                    }}>
                        {notas.length}/200
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleContinuar}
                    style={{
                        backgroundColor: Colors.PRIMARY,
                        padding: 18,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginBottom: 20
                    }}
                >
                    <Text style={{
                        color: Colors.WHITE,
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>
                        Continuar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
