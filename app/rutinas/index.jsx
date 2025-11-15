import { View, Text, FlatList, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { UserContext } from '../../context/UserContext'
import Colors from '../../shared/Colors'
// TEMPORALMENTE COMENTADO PARA EVITAR CRASH
// import { HugeiconsIcon } from '@hugeicons/react-native'
// import { PlusSignIcon, DumbbellIcon, Star01Icon, Copy01Icon, Delete02Icon, PlayIcon } from '@hugeicons/core-free-icons'
import moment from 'moment'
import 'moment/locale/es'

export default function MisRutinas() {
    const { user } = useContext(UserContext)
    const router = useRouter()
    const rutinas = useQuery(
        api.Rutinas.ObtenerRutinasPorUsuario,
        user?._id ? { uid: user._id } : "skip"
    )
    const eliminarRutina = useMutation(api.Rutinas.EliminarRutina)
    const marcarFavorita = useMutation(api.Rutinas.MarcarFavorita)
    const duplicarRutina = useMutation(api.Rutinas.DuplicarRutina)

    moment.locale('es')

    const handleEliminarRutina = (rutinaId, nombreRutina) => {
        Alert.alert(
            '¿Eliminar rutina?',
            `¿Estás seguro de eliminar "${nombreRutina}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await eliminarRutina({ id: rutinaId })
                            Alert.alert('Eliminado', 'Rutina eliminada correctamente')
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la rutina')
                        }
                    }
                }
            ]
        )
    }

    const handleDuplicarRutina = (rutinaId, nombreRutina) => {
        Alert.prompt(
            'Duplicar rutina',
            'Ingresa el nombre para la nueva rutina:',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Duplicar',
                    onPress: async (nuevoNombre) => {
                        if (!nuevoNombre || nuevoNombre.trim() === '') {
                            Alert.alert('Error', 'Debes ingresar un nombre')
                            return
                        }
                        try {
                            await duplicarRutina({ 
                                id: rutinaId, 
                                nuevoNombre: nuevoNombre.trim() 
                            })
                            Alert.alert('¡Listo!', 'Rutina duplicada correctamente')
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo duplicar la rutina')
                        }
                    }
                }
            ],
            'plain-text',
            `${nombreRutina} (Copia)`
        )
    }

    const handleToggleFavorita = async (rutinaId, esFavorita) => {
        try {
            await marcarFavorita({ id: rutinaId, favorita: !esFavorita })
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar')
        }
    }

    const calcularDuracionAproximada = (ejercicios) => {
        if (!ejercicios || ejercicios.length === 0) return 0
        const tiempoPorEjercicio = ejercicios.reduce((total, ej) => {
            const tiempoSeries = ej.series * 30 // 30 seg por serie
            const tiempoDescanso = ej.series * ej.descanso
            return total + tiempoSeries + tiempoDescanso
        }, 0)
        return Math.round(tiempoPorEjercicio / 60) // Convertir a minutos
    }

    const renderRutina = ({ item }) => {
        const duracion = calcularDuracionAproximada(item.ejercicios)
        const cantidadEjercicios = item.ejercicios?.length || 0

        return (
            <View style={{
                backgroundColor: Colors.WHITE,
                borderRadius: 15,
                padding: 15,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1 }}>
                                {item.nombreRutina}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => handleToggleFavorita(item._id, item.favorita)}
                                style={{ padding: 5 }}
                            >
                                <Text style={{ fontSize: 24 }}>
                                    {item.favorita ? '⭐' : '☆'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={{ color: Colors.PRIMARY, fontSize: 14, marginBottom: 5 }}>
                            {item.objetivo}
                        </Text>
                        
                        <Text style={{ color: Colors.GRAY, fontSize: 14 }}>
                            {cantidadEjercicios} ejercicio{cantidadEjercicios !== 1 ? 's' : ''} • {duracion} min aprox
                        </Text>
                        
                        <Text style={{ color: Colors.GRAY, fontSize: 12, marginTop: 5 }}>
                            Creada {moment(item.fechaCreacion).fromNow()}
                        </Text>
                    </View>
                </View>

                <View style={{ 
                    flexDirection: 'row', 
                    marginTop: 15, 
                    gap: 8,
                    alignItems: 'center'
                }}>
                    {/* Botón Iniciar - Más grande */}
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/rutinas/ejecutar-rutina',
                            params: { rutinaId: item._id }
                        })}
                        style={{
                            flex: 1,
                            backgroundColor: Colors.PRIMARY,
                            paddingVertical: 12,
                            paddingHorizontal: 15,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <Text style={{ color: Colors.WHITE, fontSize: 16 }}>▶</Text>
                        <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 15 }}>
                            Iniciar
                        </Text>
                    </TouchableOpacity>

                    {/* Botón Editar */}
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/rutinas/configurar-series',
                            params: { 
                                rutinaId: item._id,
                                modo: 'editar'
                            }
                        })}
                        style={{
                            backgroundColor: '#FFF3E0',
                            padding: 12,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 48
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>✏️</Text>
                    </TouchableOpacity>

                    {/* Botón Eliminar */}
                    <TouchableOpacity
                        onPress={() => handleEliminarRutina(item._id, item.nombreRutina)}
                        style={{
                            backgroundColor: '#FFEBEE',
                            padding: 12,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 48
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>🗑️</Text>
                    </TouchableOpacity>
                </View>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                            Mis Rutinas
                        </Text>
                        <Text style={{ fontSize: 16, color: Colors.GRAY, marginTop: 5 }}>
                            {rutinas?.length || 0} rutina{rutinas?.length !== 1 ? 's' : ''} guardada{rutinas?.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={() => router.push('/rutinas/progreso')}
                        style={{
                            backgroundColor: Colors.PRIMARY,
                            padding: 12,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5
                        }}
                    >
                        <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 14 }}>
                            📊 Progreso
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={rutinas || []}
                renderItem={renderRutina}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 40,
                        backgroundColor: Colors.WHITE,
                        borderRadius: 15,
                        marginTop: 20
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: Colors.GRAY,
                            marginTop: 20,
                            textAlign: 'center'
                        }}>
                            No tienes rutinas aún
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.GRAY,
                            marginTop: 10,
                            textAlign: 'center'
                        }}>
                            Crea tu primera rutina de ejercicios
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                onPress={() => router.push('/rutinas/crear-rutina')}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                    backgroundColor: Colors.PRIMARY,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 8
                }}
            >
                <Text style={{ color: Colors.WHITE, fontSize: 40, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
        </View>
    )
}
