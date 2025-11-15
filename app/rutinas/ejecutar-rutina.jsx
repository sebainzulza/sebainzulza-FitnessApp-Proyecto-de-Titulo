import { View, Text, ScrollView, Platform, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { UserContext } from '../../context/UserContext'
import Colors from '../../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { 
    ArrowLeft01Icon, 
    ArrowRight01Icon, 
    CheckmarkSquare02Icon, 
    SquareIcon,
    Timer01Icon,
    TrophyIcon
} from '@hugeicons/core-free-icons'
import moment from 'moment'
import 'moment/locale/es'

export default function EjecutarRutina() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { user } = useContext(UserContext)
    const rutina = useQuery(
        api.Rutinas.ObtenerRutinaPorId,
        params.rutinaId ? { id: params.rutinaId } : "skip"
    )
    const guardarHistorial = useMutation(api.Rutinas.GuardarHistorialRutina)

    const [ejercicioActualIndex, setEjercicioActualIndex] = useState(0)
    const [seriesCompletadas, setSeriesCompletadas] = useState({})
    const [tiempoInicio, setTiempoInicio] = useState(Date.now())
    const [descansoActivo, setDescansoActivo] = useState(false)
    const [tiempoDescanso, setTiempoDescanso] = useState(0)
    const [intervalId, setIntervalId] = useState(null)

    moment.locale('es')

    useEffect(() => {
        if (rutina) {
            // Inicializar series completadas
            const inicial = {}
            rutina.ejercicios.forEach((_, idx) => {
                inicial[idx] = Array(rutina.ejercicios[idx].series).fill(false)
            })
            setSeriesCompletadas(inicial)
        }
    }, [rutina])

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [intervalId])

    const iniciarDescanso = (segundos) => {
        setTiempoDescanso(segundos)
        setDescansoActivo(true)

        const id = setInterval(() => {
            setTiempoDescanso((prev) => {
                if (prev <= 1) {
                    clearInterval(id)
                    setDescansoActivo(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        setIntervalId(id)
    }

    const toggleSerie = (ejercicioIdx, serieIdx) => {
        const nuevasSeriesCompletadas = { ...seriesCompletadas }
        nuevasSeriesCompletadas[ejercicioIdx][serieIdx] = !nuevasSeriesCompletadas[ejercicioIdx][serieIdx]
        setSeriesCompletadas(nuevasSeriesCompletadas)

        // Si completó una serie, iniciar descanso automático
        if (nuevasSeriesCompletadas[ejercicioIdx][serieIdx] && !descansoActivo) {
            const ejercicio = rutina.ejercicios[ejercicioIdx]
            iniciarDescanso(ejercicio.descanso)
        }
    }

    const ejercicioAnterior = () => {
        if (ejercicioActualIndex > 0) {
            setEjercicioActualIndex(ejercicioActualIndex - 1)
            if (intervalId) {
                clearInterval(intervalId)
                setDescansoActivo(false)
            }
        }
    }

    const ejercicioSiguiente = () => {
        if (ejercicioActualIndex < rutina.ejercicios.length - 1) {
            setEjercicioActualIndex(ejercicioActualIndex + 1)
            if (intervalId) {
                clearInterval(intervalId)
                setDescansoActivo(false)
            }
        }
    }

    const calcularProgreso = () => {
        let seriesTotal = 0
        let seriesRealizadas = 0

        Object.keys(seriesCompletadas).forEach((key) => {
            seriesTotal += seriesCompletadas[key].length
            seriesRealizadas += seriesCompletadas[key].filter(s => s).length
        })

        return {
            seriesRealizadas,
            seriesTotal,
            porcentaje: seriesTotal > 0 ? (seriesRealizadas / seriesTotal) * 100 : 0
        }
    }

    const calcularVolumenTotal = () => {
        let volumen = 0
        rutina.ejercicios.forEach((ejercicio, idx) => {
            const seriesCompletas = seriesCompletadas[idx]?.filter(s => s).length || 0
            volumen += ejercicio.peso * ejercicio.repeticiones * seriesCompletas
        })
        return volumen
    }

    const finalizarRutina = async () => {
        const progreso = calcularProgreso()
        
        if (progreso.seriesRealizadas === 0) {
            Alert.alert('Aviso', 'No has completado ninguna serie. ¿Seguro que quieres finalizar?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Finalizar', onPress: () => guardarYSalir() }
            ])
            return
        }

        guardarYSalir()
    }

    const guardarYSalir = async () => {
        const duracion = Math.round((Date.now() - tiempoInicio) / 60000) // minutos
        const volumen = calcularVolumenTotal()
        const progreso = calcularProgreso()

        const ejerciciosRealizados = rutina.ejercicios.map((ejercicio, idx) => ({
            ejercicioId: ejercicio.ejercicioId,
            seriesCompletadas: seriesCompletadas[idx].map((completada, serieIdx) => ({
                serie: serieIdx + 1,
                repeticiones: ejercicio.repeticiones,
                peso: ejercicio.peso,
                completada
            }))
        }))

        try {
            await guardarHistorial({
                uid: user._id,
                rutinaId: params.rutinaId,
                fecha: moment().format('DD/MM/YYYY'),
                duracion,
                ejerciciosRealizados,
                volumenTotal: volumen,
                completada: progreso.porcentaje === 100
            })

            Alert.alert(
                '¡Rutina Finalizada! 🎉',
                `Has completado ${progreso.seriesRealizadas} de ${progreso.seriesTotal} series\n` +
                `Volumen total: ${volumen} kg\n` +
                `Duración: ${duracion} minutos`,
                [
                    {
                        text: 'Ver mis rutinas',
                        onPress: () => router.replace('/rutinas')
                    }
                ]
            )
        } catch (error) {
            console.error('Error al guardar historial:', error)
            Alert.alert('Error', 'No se pudo guardar el historial')
        }
    }

    if (!rutina) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Cargando rutina...</Text>
            </View>
        )
    }

    const ejercicioActual = rutina.ejercicios[ejercicioActualIndex]
    const progreso = calcularProgreso()

    return (
        <View style={{ flex: 1, backgroundColor: Colors.PRIMARY }}>
            {/* Header */}
            <View style={{
                padding: 20,
                paddingTop: Platform.OS === 'ios' ? 50 : 40,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <TouchableOpacity 
                        onPress={() => {
                            Alert.alert(
                                '¿Salir?',
                                '¿Quieres salir sin finalizar la rutina?',
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    { text: 'Salir', onPress: () => router.back(), style: 'destructive' }
                                ]
                            )
                        }}
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={Colors.WHITE} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={finalizarRutina}>
                        <Text style={{ color: Colors.WHITE, fontSize: 16, fontWeight: 'bold' }}>
                            Finalizar
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.WHITE }}>
                    {rutina.nombreRutina}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.WHITE, opacity: 0.9, marginTop: 5 }}>
                    Ejercicio {ejercicioActualIndex + 1} de {rutina.ejercicios.length}
                </Text>

                {/* Barra de progreso */}
                <View style={{
                    height: 8,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                    marginTop: 15,
                    overflow: 'hidden'
                }}>
                    <View style={{
                        height: '100%',
                        width: `${progreso.porcentaje}%`,
                        backgroundColor: Colors.WHITE,
                        borderRadius: 4
                    }} />
                </View>
                <Text style={{ color: Colors.WHITE, fontSize: 12, marginTop: 5, textAlign: 'right' }}>
                    {progreso.seriesRealizadas}/{progreso.seriesTotal} series completadas
                </Text>
            </View>

            {/* Contenido principal */}
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: '#F5F5F5',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}
                contentContainerStyle={{ padding: 20 }}
            >
                {/* GIF del ejercicio */}
                <View style={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: 20,
                    padding: 15,
                    marginBottom: 20,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 5
                }}>
                    <Image
                        source={{ uri: ejercicioActual.gifUrl }}
                        style={{
                            width: '100%',
                            height: 300,
                            borderRadius: 15,
                            backgroundColor: '#F5F5F5'
                        }}
                        resizeMode="contain"
                    />
                    
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: Colors.DARKBLUE,
                        marginTop: 15,
                        textAlign: 'center'
                    }}>
                        {ejercicioActual.nombre}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 20 }}>
                        <Text style={{ color: Colors.GRAY }}>
                            {ejercicioActual.series} series × {ejercicioActual.repeticiones} reps
                        </Text>
                        <Text style={{ color: Colors.PRIMARY, fontWeight: 'bold' }}>
                            {ejercicioActual.peso} kg
                        </Text>
                    </View>
                </View>

                {/* Descanso activo */}
                {descansoActivo && (
                    <View style={{
                        backgroundColor: '#FFF3E0',
                        borderRadius: 15,
                        padding: 20,
                        marginBottom: 20,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#FF9800'
                    }}>
                        <HugeiconsIcon icon={Timer01Icon} size={40} color="#FF9800" />
                        <Text style={{
                            fontSize: 48,
                            fontWeight: 'bold',
                            color: '#FF9800',
                            marginVertical: 10
                        }}>
                            {tiempoDescanso}
                        </Text>
                        <Text style={{ fontSize: 16, color: '#F57C00' }}>
                            Descansando...
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (intervalId) clearInterval(intervalId)
                                setDescansoActivo(false)
                            }}
                            style={{
                                marginTop: 15,
                                paddingVertical: 8,
                                paddingHorizontal: 20,
                                backgroundColor: '#FF9800',
                                borderRadius: 10
                            }}
                        >
                            <Text style={{ color: Colors.WHITE, fontWeight: 'bold' }}>
                                Saltar descanso
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Series */}
                <View style={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 20
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.DARKBLUE,
                        marginBottom: 15
                    }}>
                        Series
                    </Text>

                    {Array.from({ length: ejercicioActual.series }).map((_, serieIdx) => (
                        <TouchableOpacity
                            key={serieIdx}
                            onPress={() => toggleSerie(ejercicioActualIndex, serieIdx)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 15,
                                backgroundColor: seriesCompletadas[ejercicioActualIndex]?.[serieIdx] 
                                    ? Colors.SECONDARY 
                                    : '#F5F5F5',
                                borderRadius: 12,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: seriesCompletadas[ejercicioActualIndex]?.[serieIdx]
                                    ? Colors.PRIMARY
                                    : 'transparent'
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                <HugeiconsIcon
                                    icon={seriesCompletadas[ejercicioActualIndex]?.[serieIdx] 
                                        ? CheckmarkSquare02Icon 
                                        : SquareIcon}
                                    size={28}
                                    color={seriesCompletadas[ejercicioActualIndex]?.[serieIdx]
                                        ? Colors.PRIMARY
                                        : Colors.GRAY}
                                />
                                <View>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: Colors.DARKBLUE
                                    }}>
                                        Serie {serieIdx + 1}
                                    </Text>
                                    <Text style={{ color: Colors.GRAY, fontSize: 14 }}>
                                        {ejercicioActual.repeticiones} reps × {ejercicioActual.peso} kg
                                    </Text>
                                </View>
                            </View>

                            {seriesCompletadas[ejercicioActualIndex]?.[serieIdx] && (
                                <Text style={{
                                    color: Colors.PRIMARY,
                                    fontWeight: 'bold',
                                    fontSize: 14
                                }}>
                                    ✓ Completada
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Navegación entre ejercicios */}
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginBottom: 20
                }}>
                    <TouchableOpacity
                        onPress={ejercicioAnterior}
                        disabled={ejercicioActualIndex === 0}
                        style={{
                            flex: 1,
                            backgroundColor: ejercicioActualIndex === 0 ? '#E0E0E0' : Colors.PRIMARY,
                            padding: 15,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <HugeiconsIcon 
                            icon={ArrowLeft01Icon} 
                            size={20} 
                            color={ejercicioActualIndex === 0 ? Colors.GRAY : Colors.WHITE} 
                        />
                        <Text style={{
                            color: ejercicioActualIndex === 0 ? Colors.GRAY : Colors.WHITE,
                            fontWeight: 'bold'
                        }}>
                            Anterior
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ejercicioSiguiente}
                        disabled={ejercicioActualIndex === rutina.ejercicios.length - 1}
                        style={{
                            flex: 1,
                            backgroundColor: ejercicioActualIndex === rutina.ejercicios.length - 1 
                                ? '#E0E0E0' 
                                : Colors.PRIMARY,
                            padding: 15,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <Text style={{
                            color: ejercicioActualIndex === rutina.ejercicios.length - 1 
                                ? Colors.GRAY 
                                : Colors.WHITE,
                            fontWeight: 'bold'
                        }}>
                            Siguiente
                        </Text>
                        <HugeiconsIcon 
                            icon={ArrowRight01Icon} 
                            size={20} 
                            color={ejercicioActualIndex === rutina.ejercicios.length - 1 
                                ? Colors.GRAY 
                                : Colors.WHITE} 
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}
