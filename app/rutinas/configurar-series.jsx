import { View, Text, ScrollView, Platform, TouchableOpacity, Alert, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { UserContext } from '../../context/UserContext'
import Colors from '../../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { ArrowLeft01Icon, PlusSignIcon, MinusSignIcon, Delete02Icon } from '@hugeicons/core-free-icons'

export default function ConfigurarSeries() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { user } = useContext(UserContext)
    const crearRutina = useMutation(api.Rutinas.CrearRutina)
    const actualizarRutina = useMutation(api.Rutinas.ActualizarRutina)
    
    // Si estamos en modo editar, cargar la rutina existente
    const rutinaExistente = useQuery(
        api.Rutinas.ObtenerRutinaPorId,
        params.modo === 'editar' && params.rutinaId ? { id: params.rutinaId } : "skip"
    )
    
    const [datosRutina, setDatosRutina] = useState(null)
    const [ejerciciosConfig, setEjerciciosConfig] = useState([])
    const [guardando, setGuardando] = useState(false)
    const [cargando, setCargando] = useState(true)
    const [inicializado, setInicializado] = useState(false)

    useEffect(() => {
        // Solo ejecutar UNA VEZ
        if (!inicializado) {
            inicializarDatos()
            setInicializado(true)
        }
    }, [inicializado])

    // Cargar datos cuando la rutina existente esté disponible
    useEffect(() => {
        if (params.modo === 'editar' && rutinaExistente && !datosRutina) {
            console.log('📝 Cargando rutina para editar:', rutinaExistente)
            cargarRutinaExistente(rutinaExistente)
        }
    }, [rutinaExistente])

    const cargarRutinaExistente = (rutina) => {
        console.log('=== CARGANDO RUTINA EXISTENTE ===')
        
        setDatosRutina({
            nombreRutina: rutina.nombreRutina,
            objetivo: rutina.objetivo,
            notas: rutina.notas || ''
        })

        setEjerciciosConfig(rutina.ejercicios)
        setCargando(false)
        console.log('✅ Rutina cargada para edición')
    }

    const inicializarDatos = () => {
        console.log('=== INICIO CONFIGURAR SERIES ===')
        console.log('Modo:', params.modo)
        
        // Si es modo editar, esperar a que cargue rutinaExistente
        if (params.modo === 'editar') {
            console.log('Esperando rutina existente...')
            return
        }
        
        try {
            if (!params.datosCompletos) {
                console.error('❌ No hay datos')
                setCargando(false)
                Alert.alert('Error', 'No se encontraron datos', [
                    { text: 'OK', onPress: () => router.back() }
                ])
                return
            }

            const datos = JSON.parse(params.datosCompletos)
            console.log('📋 Datos recibidos:', datos)
            
            if (!datos.ejercicios || datos.ejercicios.length === 0) {
                console.error('❌ No hay ejercicios')
                setCargando(false)
                Alert.alert('Error', 'No hay ejercicios', [
                    { text: 'OK', onPress: () => router.back() }
                ])
                return
            }

            setDatosRutina({
                nombreRutina: datos.nombreRutina,
                objetivo: datos.objetivo,
                notas: datos.notas || ''
            })

            const ejerciciosConConfig = datos.ejercicios.map((ej, idx) => ({
                ...ej,
                series: 3,
                repeticiones: 12,
                peso: 0,
                descanso: 60,
                orden: idx
            }))
            
            console.log('✅', ejerciciosConConfig.length, 'ejercicios configurados')
            setEjerciciosConfig(ejerciciosConConfig)
            setCargando(false)
            
        } catch (error) {
            console.error('❌ Error:', error)
            setCargando(false)
            Alert.alert('Error', error.message, [
                { text: 'OK', onPress: () => router.back() }
            ])
        }
    }

    const actualizarEjercicio = (index, campo, valor) => {
        const nuevos = [...ejerciciosConfig]
        nuevos[index] = { ...nuevos[index], [campo]: valor }
        setEjerciciosConfig(nuevos)
    }

    const incrementar = (index, campo) => {
        const valor = ejerciciosConfig[index][campo]
        let nuevo = valor + 1
        
        if (campo === 'series' && nuevo > 10) nuevo = 10
        if (campo === 'repeticiones' && nuevo > 50) nuevo = 50
        if (campo === 'peso' && nuevo > 500) nuevo = 500
        if (campo === 'descanso') nuevo = valor + 15
        
        actualizarEjercicio(index, campo, nuevo)
    }

    const decrementar = (index, campo) => {
        const valor = ejerciciosConfig[index][campo]
        let nuevo = valor - 1
        
        if (campo === 'descanso') nuevo = valor - 15
        if (nuevo < 0) nuevo = 0
        
        actualizarEjercicio(index, campo, nuevo)
    }

    const eliminarEjercicio = (index) => {
        Alert.alert(
            '¿Eliminar ejercicio?',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        const nuevos = ejerciciosConfig.filter((_, i) => i !== index)
                        setEjerciciosConfig(nuevos)
                    }
                }
            ]
        )
    }

    const handleGuardarRutina = async () => {
        if (ejerciciosConfig.length === 0) {
            Alert.alert('Error', 'Debes tener al menos un ejercicio')
            return
        }

        if (!datosRutina) {
            Alert.alert('Error', 'Error con los datos de la rutina')
            return
        }

        console.log('💾 Guardando rutina...')
        console.log('Modo:', params.modo)
        setGuardando(true)
        
        try {
            if (params.modo === 'editar') {
                // ACTUALIZAR rutina existente
                console.log('Actualizando rutina ID:', params.rutinaId)
                await actualizarRutina({
                    id: params.rutinaId,
                    nombreRutina: datosRutina.nombreRutina,
                    objetivo: datosRutina.objetivo,
                    notas: datosRutina.notas,
                    ejercicios: ejerciciosConfig
                })

                console.log('✅ Rutina actualizada')
                setGuardando(false)
                
                Alert.alert(
                    '¡Rutina actualizada!',
                    'Los cambios han sido guardados exitosamente',
                    [
                        { 
                            text: 'OK', 
                            onPress: () => router.replace('/rutinas')
                        }
                    ],
                    { cancelable: false }
                )
            } else {
                // CREAR nueva rutina
                await crearRutina({
                    uid: user._id,
                    nombreRutina: datosRutina.nombreRutina,
                    objetivo: datosRutina.objetivo,
                    notas: datosRutina.notas,
                    ejercicios: ejerciciosConfig,
                    favorita: false
                })

                console.log('✅ Rutina creada')
                setGuardando(false)
                
                Alert.alert(
                    '¡Rutina creada!',
                    'Tu rutina ha sido guardada exitosamente',
                    [
                        { 
                            text: 'OK', 
                            onPress: () => router.replace('/rutinas')
                        }
                    ],
                    { cancelable: false }
                )
            }
        } catch (error) {
            console.error('❌ Error:', error)
            setGuardando(false)
            Alert.alert('Error', 'No se pudo guardar: ' + error.message)
        }
    }

    if (cargando) {
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text style={{ marginTop: 10, color: Colors.GRAY }}>Cargando...</Text>
            </View>
        )
    }

    if (ejerciciosConfig.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.GRAY }}>No hay ejercicios</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, backgroundColor: Colors.PRIMARY, padding: 15, borderRadius: 10 }}>
                    <Text style={{ color: Colors.WHITE }}>Volver</Text>
                </TouchableOpacity>
            </View>
        )
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
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 15 }}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={Colors.DARKBLUE} />
                </TouchableOpacity>
                
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                    {params.modo === 'editar' ? 'Editar Rutina' : 'Configurar Ejercicios'}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.GRAY, marginTop: 5 }}>
                    {params.modo === 'editar' 
                        ? 'Modifica las series, repeticiones y pesos'
                        : 'Paso 3 de 3: Define series, repeticiones y pesos'}
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                {ejerciciosConfig.map((ejercicio, index) => (
                    <View key={index} style={{
                        backgroundColor: Colors.WHITE,
                        borderRadius: 15,
                        padding: 15,
                        marginBottom: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3
                    }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                            <Image
                                source={{ uri: ejercicio.gifUrl }}
                                style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: '#F5F5F5' }}
                                resizeMode="cover"
                            />
                            
                            <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.DARKBLUE, marginBottom: 5 }} numberOfLines={2}>
                                    {ejercicio.nombre}
                                </Text>
                                <Text style={{ fontSize: 12, color: Colors.GRAY }}>
                                    {ejercicio.equipamiento}
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => eliminarEjercicio(index)} style={{ padding: 8, alignSelf: 'flex-start' }}>
                                <HugeiconsIcon icon={Delete02Icon} size={20} color="#F44336" />
                            </TouchableOpacity>
                        </View>

                        {/* Series */}
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.DARKBLUE, marginBottom: 8 }}>Series</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => decrementar(index, 'series')} style={{ backgroundColor: Colors.SECONDARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={MinusSignIcon} size={20} color={Colors.PRIMARY} />
                                </TouchableOpacity>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                                    {ejercicio.series}
                                </Text>
                                <TouchableOpacity onPress={() => incrementar(index, 'series')} style={{ backgroundColor: Colors.PRIMARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={PlusSignIcon} size={20} color={Colors.WHITE} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Repeticiones */}
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.DARKBLUE, marginBottom: 8 }}>Repeticiones</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => decrementar(index, 'repeticiones')} style={{ backgroundColor: Colors.SECONDARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={MinusSignIcon} size={20} color={Colors.PRIMARY} />
                                </TouchableOpacity>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                                    {ejercicio.repeticiones}
                                </Text>
                                <TouchableOpacity onPress={() => incrementar(index, 'repeticiones')} style={{ backgroundColor: Colors.PRIMARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={PlusSignIcon} size={20} color={Colors.WHITE} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Peso */}
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.DARKBLUE, marginBottom: 8 }}>Peso (kg)</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => decrementar(index, 'peso')} style={{ backgroundColor: Colors.SECONDARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={MinusSignIcon} size={20} color={Colors.PRIMARY} />
                                </TouchableOpacity>
                                <TextInput
                                    value={ejercicio.peso.toString()}
                                    onChangeText={(text) => {
                                        const valor = parseInt(text) || 0
                                        if (valor <= 500) actualizarEjercicio(index, 'peso', valor)
                                    }}
                                    keyboardType="numeric"
                                    style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.DARKBLUE }}
                                />
                                <TouchableOpacity onPress={() => incrementar(index, 'peso')} style={{ backgroundColor: Colors.PRIMARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={PlusSignIcon} size={20} color={Colors.WHITE} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Descanso */}
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.DARKBLUE, marginBottom: 8 }}>Descanso (segundos)</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => decrementar(index, 'descanso')} style={{ backgroundColor: Colors.SECONDARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={MinusSignIcon} size={20} color={Colors.PRIMARY} />
                                </TouchableOpacity>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                                    {ejercicio.descanso}s
                                </Text>
                                <TouchableOpacity onPress={() => incrementar(index, 'descanso')} style={{ backgroundColor: Colors.PRIMARY, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <HugeiconsIcon icon={PlusSignIcon} size={20} color={Colors.WHITE} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: Colors.WHITE,
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5
            }}>
                <TouchableOpacity
                    onPress={handleGuardarRutina}
                    disabled={guardando}
                    style={{
                        backgroundColor: guardando ? Colors.GRAY : Colors.PRIMARY,
                        padding: 18,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: Colors.WHITE, fontSize: 18, fontWeight: 'bold' }}>
                        {guardando 
                            ? 'Guardando...' 
                            : params.modo === 'editar' 
                                ? 'Actualizar Rutina' 
                                : 'Guardar Rutina'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
