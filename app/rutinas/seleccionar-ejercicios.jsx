import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'

// Partes del cuerpo disponibles
const PARTES_CUERPO = [
    { id: 'back', nombre: 'Espalda' },
    { id: 'chest', nombre: 'Pecho' },
    { id: 'lower arms', nombre: 'Antebrazos' },
    { id: 'lower legs', nombre: 'Piernas inferiores' },
    { id: 'shoulders', nombre: 'Hombros' },
    { id: 'upper arms', nombre: 'Brazos' },
    { id: 'upper legs', nombre: 'Piernas superiores' },
    { id: 'waist', nombre: 'Abdomen' }
]

// Función simple para llamar a la API (sin importar EjerciciosAPI)
const obtenerEjerciciosPorParte = async (parteCuerpo) => {
    try {
        const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${parteCuerpo}`
        console.log('📡 Llamando a:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '7916c9f2b4mshbc093af4a01ea44p12fbf8jsn6056faccdb2a',
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        })
        
        if (!response.ok) {
            console.error('❌ Error HTTP:', response.status)
            return []
        }
        
        const data = await response.json()
        console.log('📦 Datos recibidos:', data?.length || 0, 'ejercicios')
        return data || []
    } catch (error) {
        console.error('❌ Error al obtener ejercicios:', error)
        return []
    }
}

export default function SeleccionarEjercicios() {
    const router = useRouter()
    const params = useLocalSearchParams()
    
    const [datosRutina, setDatosRutina] = useState(null)
    const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([])
    const [ejercicios, setEjercicios] = useState([])
    const [cargando, setCargando] = useState(false)
    const [parteSeleccionada, setParteSeleccionada] = useState('back')

    useEffect(() => {
        console.log('Params recibidos:', params)
        if (params.datosRutina) {
            try {
                const datos = JSON.parse(params.datosRutina)
                console.log('Datos parseados:', datos)
                setDatosRutina(datos)
            } catch (error) {
                console.error('Error al parsear:', error)
            }
        }
        
        // Cargar ejercicios de la API
        cargarEjercicios()
    }, [])

    // Recargar cuando cambie la parte seleccionada
    useEffect(() => {
        if (parteSeleccionada) {
            cargarEjercicios()
        }
    }, [parteSeleccionada])

    const cargarEjercicios = async () => {
        setCargando(true)
        console.log('🔄 Cargando ejercicios de:', parteSeleccionada)
        
        try {
            const data = await obtenerEjerciciosPorParte(parteSeleccionada)
            console.log('✅ API respondió con', data?.length || 0, 'ejercicios')
            
            if (data && Array.isArray(data) && data.length > 0) {
                // Limitar a 20 ejercicios
                const ejerciciosLimitados = data.slice(0, 20)
                setEjercicios(ejerciciosLimitados)
                console.log('✅ Mostrando', ejerciciosLimitados.length, 'ejercicios')
            } else {
                console.warn('⚠️ No se encontraron ejercicios')
                setEjercicios([])
            }
        } catch (error) {
            console.error('❌ Error:', error)
            setEjercicios([])
        } finally {
            setCargando(false)
        }
    }

    const toggleEjercicio = (ejercicio) => {
        const yaSeleccionado = ejerciciosSeleccionados.find(e => e.ejercicioId === ejercicio.id)
        
        if (yaSeleccionado) {
            // Quitar de la lista
            setEjerciciosSeleccionados(ejerciciosSeleccionados.filter(e => e.ejercicioId !== ejercicio.id))
            console.log('❌ Deseleccionado:', ejercicio.name)
        } else {
            // Agregar a la lista con SOLO los campos que Convex acepta
            const ejercicioFormateado = {
                ejercicioId: ejercicio.id, // Campo requerido por Convex
                nombre: ejercicio.name,
                equipamiento: ejercicio.equipment,
                parteCuerpo: ejercicio.bodyPart,
                gifUrl: ejercicio.gifUrl
            }
            setEjerciciosSeleccionados([...ejerciciosSeleccionados, ejercicioFormateado])
            console.log('✅ Seleccionado:', ejercicio.name)
        }
    }

    const handleContinuar = () => {
        if (!datosRutina) return
        
        const datosCompletos = {
            ...datosRutina,
            ejercicios: ejerciciosSeleccionados
        }
        
        console.log('Continuar con:', datosCompletos)
        
        router.push({
            pathname: '/rutinas/configurar-series',
            params: {
                datosCompletos: JSON.stringify(datosCompletos)
            }
        })
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 24, color: '#000000', marginBottom: 10 }}>
                    Seleccionar Ejercicios
                </Text>
                
                {datosRutina && (
                    <Text style={{ fontSize: 16, color: '#666666', marginBottom: 20 }}>
                        Rutina: {datosRutina.nombreRutina}
                    </Text>
                )}

                {/* SELECTOR DE PARTES DEL CUERPO INLINE */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 10 }}>
                    Selecciona una parte del cuerpo:
                </Text>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                    {PARTES_CUERPO.map((parte) => {
                        const seleccionada = parteSeleccionada === parte.id
                        
                        return (
                            <TouchableOpacity
                                key={parte.id}
                                style={{
                                    backgroundColor: seleccionada ? '#3498DB' : '#F0F0F0',
                                    paddingHorizontal: 15,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    marginRight: 8,
                                    marginBottom: 8,
                                    borderWidth: 1,
                                    borderColor: seleccionada ? '#2980B9' : '#D0D0D0'
                                }}
                                onPress={() => {
                                    console.log('🎯 Cambiando a:', parte.nombre)
                                    setParteSeleccionada(parte.id)
                                    setEjerciciosSeleccionados([]) // Limpiar selección
                                }}
                            >
                                <Text style={{
                                    color: seleccionada ? '#FFFFFF' : '#333333',
                                    fontSize: 13,
                                    fontWeight: seleccionada ? 'bold' : 'normal'
                                }}>
                                    {parte.nombre}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginTop: 20, marginBottom: 15 }}>
                    Ejercicios disponibles:
                </Text>

                {/* LOADING */}
                {cargando && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#3498DB" />
                        <Text style={{ marginTop: 10, color: '#666666' }}>Cargando ejercicios...</Text>
                    </View>
                )}

                {/* LISTA DE EJERCICIOS CON MAP */}
                {!cargando && ejercicios.map((ejercicio) => {
                    const seleccionado = ejerciciosSeleccionados.some(e => e.ejercicioId === ejercicio.id)
                    
                    return (
                        <TouchableOpacity
                            key={ejercicio.id}
                            style={{
                                backgroundColor: seleccionado ? '#3498DB' : '#F5F5F5',
                                padding: 12,
                                borderRadius: 10,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: seleccionado ? '#2980B9' : '#E0E0E0',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                            onPress={() => toggleEjercicio(ejercicio)}
                        >
                            {/* IMAGEN DEL EJERCICIO */}
                            {ejercicio.gifUrl && (
                                <Image
                                    source={{ uri: ejercicio.gifUrl }}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        backgroundColor: '#E0E0E0',
                                        marginRight: 12
                                    }}
                                    resizeMode="cover"
                                    onError={(error) => {
                                        console.log('⚠️ Error cargando imagen:', ejercicio.name)
                                    }}
                                />
                            )}
                            
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: seleccionado ? '#FFFFFF' : '#000000',
                                    marginBottom: 5
                                }}>
                                    {ejercicio.name}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: seleccionado ? '#FFFFFF' : '#666666'
                                }}>
                                    {ejercicio.equipment} • {ejercicio.bodyPart}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}

                {/* Información de ejercicios */}
                {ejercicios.length > 0 && (
                    <View style={{ 
                        marginTop: 20, 
                        padding: 15, 
                        backgroundColor: '#F8F9FA', 
                        borderRadius: 10,
                        borderLeftWidth: 4,
                        borderLeftColor: '#3498DB'
                    }}>
                        <Text style={{ fontSize: 14, color: '#666666' }}>
                            Total de ejercicios: {ejercicios.length}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#666666', marginTop: 5 }}>
                            Seleccionados: {ejerciciosSeleccionados.length}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={{
                        backgroundColor: '#3498DB',
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 10,
                        marginTop: 30
                    }}
                    onPress={() => router.back()}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                        Volver
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#27AE60',
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 10,
                        marginTop: 15
                    }}
                    onPress={handleContinuar}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                        Continuar ({ejerciciosSeleccionados.length} ejercicios)
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
