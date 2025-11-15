import { View, Text, ScrollView, Platform, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { UserContext } from '../../context/UserContext'
import Colors from '../../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { 
    ArrowLeft01Icon, 
    TrophyIcon, 
    DumbbellIcon, 
    Timer01Icon,
    FlameIcon,
    ChartHistogramIcon
} from '@hugeicons/core-free-icons'
import moment from 'moment'
import 'moment/locale/es'

export default function EstadisticasRutinas() {
    const router = useRouter()
    const { user } = useContext(UserContext)
    
    const historialCompleto = useQuery(
        api.Rutinas.ObtenerHistorialRutinas,
        user?._id ? { uid: user._id } : "skip"
    )

    moment.locale('es')

    const calcularEstadisticas = () => {
        if (!historialCompleto || historialCompleto.length === 0) {
            return {
                totalSesiones: 0,
                sesionesCompletadas: 0,
                tiempoTotal: 0,
                volumenTotal: 0,
                promedioSesion: 0,
                racha: 0
            }
        }

        const totalSesiones = historialCompleto.length
        const sesionesCompletadas = historialCompleto.filter(h => h.completada).length
        const tiempoTotal = historialCompleto.reduce((acc, h) => acc + h.duracion, 0)
        const volumenTotal = historialCompleto.reduce((acc, h) => acc + h.volumenTotal, 0)
        const promedioSesion = tiempoTotal / totalSesiones

        // Calcular racha actual
        const fechasOrdenadas = historialCompleto
            .map(h => moment(h.fecha, 'DD/MM/YYYY'))
            .sort((a, b) => b.diff(a))
        
        let racha = 0
        let fechaActual = moment()
        
        for (let fecha of fechasOrdenadas) {
            const diferenciaDias = fechaActual.diff(fecha, 'days')
            if (diferenciaDias <= 1) {
                racha++
                fechaActual = fecha
            } else {
                break
            }
        }

        return {
            totalSesiones,
            sesionesCompletadas,
            tiempoTotal,
            volumenTotal,
            promedioSesion: Math.round(promedioSesion),
            racha
        }
    }

    const stats = calcularEstadisticas()

    const StatCard = ({ icon, titulo, valor, unidad, color }) => (
        <View style={{
            backgroundColor: Colors.WHITE,
            borderRadius: 15,
            padding: 20,
            flex: 1,
            minWidth: '47%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            borderLeftWidth: 4,
            borderLeftColor: color
        }}>
            <HugeiconsIcon icon={icon} size={32} color={color} />
            <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: Colors.DARKBLUE,
                marginTop: 10
            }}>
                {valor}
                <Text style={{ fontSize: 16, color: Colors.GRAY }}>
                    {' '}{unidad}
                </Text>
            </Text>
            <Text style={{
                fontSize: 14,
                color: Colors.GRAY,
                marginTop: 5
            }}>
                {titulo}
            </Text>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <View style={{
                padding: 20,
                paddingTop: Platform.OS === 'ios' ? 50 : 40,
                backgroundColor: Colors.PRIMARY,
            }}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ marginBottom: 15 }}
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={Colors.WHITE} />
                </TouchableOpacity>
                
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.WHITE }}>
                    Estadísticas
                </Text>
                <Text style={{ fontSize: 16, color: Colors.WHITE, marginTop: 5, opacity: 0.9 }}>
                    Tu progreso en entrenamientos
                </Text>
            </View>

            <ScrollView 
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Resumen principal */}
                <View style={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: 20,
                    padding: 25,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 5
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <HugeiconsIcon icon={TrophyIcon} size={60} color={Colors.PRIMARY} />
                        <Text style={{
                            fontSize: 48,
                            fontWeight: 'bold',
                            color: Colors.PRIMARY,
                            marginTop: 15
                        }}>
                            {stats.totalSesiones}
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            color: Colors.GRAY,
                            marginTop: 5
                        }}>
                            Sesiones de entrenamiento
                        </Text>
                    </View>
                </View>

                {/* Grid de estadísticas */}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 15,
                    marginBottom: 20
                }}>
                    <StatCard
                        icon={FlameIcon}
                        titulo="Racha actual"
                        valor={stats.racha}
                        unidad="días"
                        color="#FF6B6B"
                    />

                    <StatCard
                        icon={ChartHistogramIcon}
                        titulo="Completadas"
                        valor={stats.sesionesCompletadas}
                        unidad={`de ${stats.totalSesiones}`}
                        color="#4CAF50"
                    />

                    <StatCard
                        icon={Timer01Icon}
                        titulo="Tiempo total"
                        valor={Math.round(stats.tiempoTotal / 60)}
                        unidad="horas"
                        color="#2196F3"
                    />

                    <StatCard
                        icon={DumbbellIcon}
                        titulo="Volumen total"
                        valor={Math.round(stats.volumenTotal / 1000)}
                        unidad="toneladas"
                        color="#9C27B0"
                    />
                </View>

                {/* Promedios */}
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
                        Promedios
                    </Text>

                    <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: Colors.GRAY }}>Duración por sesión</Text>
                            <Text style={{ fontWeight: 'bold', color: Colors.DARKBLUE }}>
                                {stats.promedioSesion} min
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: Colors.GRAY }}>Volumen por sesión</Text>
                            <Text style={{ fontWeight: 'bold', color: Colors.DARKBLUE }}>
                                {stats.totalSesiones > 0 
                                    ? Math.round(stats.volumenTotal / stats.totalSesiones) 
                                    : 0} kg
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: Colors.GRAY }}>Tasa de finalización</Text>
                            <Text style={{ fontWeight: 'bold', color: Colors.DARKBLUE }}>
                                {stats.totalSesiones > 0 
                                    ? Math.round((stats.sesionesCompletadas / stats.totalSesiones) * 100)
                                    : 0}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Motivación */}
                {stats.totalSesiones > 0 && (
                    <View style={{
                        backgroundColor: '#E8F5E9',
                        borderRadius: 15,
                        padding: 20,
                        borderLeftWidth: 4,
                        borderLeftColor: '#4CAF50'
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#2E7D32',
                            marginBottom: 8
                        }}>
                            ¡Excelente trabajo! 💪
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#4CAF50',
                            lineHeight: 20
                        }}>
                            {stats.racha > 0 
                                ? `Llevas ${stats.racha} día${stats.racha > 1 ? 's' : ''} consecutivo${stats.racha > 1 ? 's' : ''} entrenando. ¡Sigue así!`
                                : 'Empieza una nueva racha de entrenamiento hoy.'}
                        </Text>
                    </View>
                )}

                {stats.totalSesiones === 0 && (
                    <View style={{
                        backgroundColor: Colors.WHITE,
                        borderRadius: 15,
                        padding: 40,
                        alignItems: 'center'
                    }}>
                        <HugeiconsIcon icon={ChartHistogramIcon} size={60} color={Colors.GRAY} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: Colors.GRAY,
                            marginTop: 20,
                            textAlign: 'center'
                        }}>
                            Sin datos aún
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.GRAY,
                            marginTop: 10,
                            textAlign: 'center'
                        }}>
                            Completa tu primera rutina para ver tus estadísticas
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}
