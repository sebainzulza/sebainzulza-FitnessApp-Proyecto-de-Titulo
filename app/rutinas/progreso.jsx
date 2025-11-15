import React, { useState, useContext, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { UserContext } from '../../context/UserContext';
import Colors from '../../shared/Colors';
import { LineChart, BarChart } from 'react-native-chart-kit';
import moment from 'moment';
import 'moment/locale/es';

export default function Progreso() {
    const { user } = useContext(UserContext);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('semana'); // 'dia', 'semana', 'mes', 'anual'
    
    moment.locale('es');
    const screenWidth = Dimensions.get('window').width;

    // Calcular fechas según periodo
    const calcularFechas = () => {
        const hoy = moment();
        let fechaInicio, fechaFin;

        switch (periodoSeleccionado) {
            case 'dia':
                fechaInicio = hoy.clone().startOf('day');
                fechaFin = hoy.clone().endOf('day');
                break;
            case 'semana':
                fechaInicio = hoy.clone().startOf('week');
                fechaFin = hoy.clone().endOf('week');
                break;
            case 'mes':
                fechaInicio = hoy.clone().startOf('month');
                fechaFin = hoy.clone().endOf('month');
                break;
            case 'anual':
                fechaInicio = hoy.clone().startOf('year');
                fechaFin = hoy.clone().endOf('year');
                break;
            default:
                fechaInicio = hoy.clone().startOf('week');
                fechaFin = hoy.clone().endOf('week');
        }

        return {
            fechaInicio: fechaInicio.format('DD/MM/YYYY'),
            fechaFin: fechaFin.format('DD/MM/YYYY')
        };
    };

    const { fechaInicio, fechaFin } = calcularFechas();

    // Obtener estadísticas
    const estadisticas = useQuery(
        api.Rutinas.ObtenerEstadisticasPorPeriodo,
        user ? {
            uid: user._id,
            fechaInicio,
            fechaFin
        } : "skip"
    );

    const PERIODOS = [
        { id: 'dia', label: 'Día', emoji: '📅' },
        { id: 'semana', label: 'Semana', emoji: '📆' },
        { id: 'mes', label: 'Mes', emoji: '🗓️' },
        { id: 'anual', label: 'Año', emoji: '📊' }
    ];

    // Preparar datos para gráficos
    const datosGraficos = useMemo(() => {
        if (!estadisticas || !estadisticas.historial || estadisticas.historial.length === 0) {
            return null;
        }

        // Agrupar por fecha
        const porFecha = {};
        estadisticas.historial.forEach(h => {
            if (!porFecha[h.fecha]) {
                porFecha[h.fecha] = {
                    entrenamientos: 0,
                    volumen: 0,
                    duracion: 0
                };
            }
            porFecha[h.fecha].entrenamientos += 1;
            porFecha[h.fecha].volumen += h.volumenTotal;
            porFecha[h.fecha].duracion += h.duracion;
        });

        // Ordenar por fecha
        const fechasOrdenadas = Object.keys(porFecha).sort((a, b) => {
            const [diaA, mesA, anioA] = a.split('/');
            const [diaB, mesB, anioB] = b.split('/');
            return new Date(`${anioA}-${mesA}-${diaA}`) - new Date(`${anioB}-${mesB}-${diaB}`);
        });

        return {
            labels: fechasOrdenadas.map(f => {
                const [dia, mes] = f.split('/');
                return `${dia}/${mes}`;
            }).slice(-7), // Últimos 7 días
            volumen: fechasOrdenadas.map(f => porFecha[f].volumen).slice(-7),
            entrenamientos: fechasOrdenadas.map(f => porFecha[f].entrenamientos).slice(-7)
        };
    }, [estadisticas]);

    if (!user || !estadisticas) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text style={{ color: '#7F8C8D', marginTop: 10 }}>Cargando estadísticas...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                paddingTop: Platform.OS === 'ios' ? 10 : 40,
                backgroundColor: '#FFFFFF'
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#F5F5F5',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 15
                    }}
                >
                    <Text style={{ fontSize: 20, color: '#333' }}>←</Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#1A1A1A'
                    }}>
                        📊 Tu Progreso
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: '#7F8C8D',
                        marginTop: 2
                    }}>
                        Analiza tu evolución
                    </Text>
                </View>
            </View>

            {/* Filtros de Periodo */}
            <View style={{
                flexDirection: 'row',
                padding: 15,
                gap: 10,
                backgroundColor: '#FFFFFF'
            }}>
                {PERIODOS.map((periodo) => (
                    <TouchableOpacity
                        key={periodo.id}
                        onPress={() => setPeriodoSeleccionado(periodo.id)}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 8,
                            borderRadius: 12,
                            backgroundColor: periodoSeleccionado === periodo.id 
                                ? Colors.PRIMARY 
                                : '#F5F5F5',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: periodoSeleccionado === periodo.id ? 0 : 1,
                            borderColor: '#E0E0E0'
                        }}
                    >
                        <Text style={{ fontSize: 18, marginBottom: 2 }}>{periodo.emoji}</Text>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: periodoSeleccionado === periodo.id ? 'bold' : 'normal',
                            color: periodoSeleccionado === periodo.id ? Colors.WHITE : '#7F8C8D'
                        }}>
                            {periodo.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Contenido */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 15 }}
            >
                {/* Tarjetas de Resumen */}
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginBottom: 20
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        padding: 15,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2
                    }}>
                        <Text style={{ fontSize: 24, marginBottom: 5 }}>🏋️</Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                            Entrenamientos
                        </Text>
                        <Text style={{
                            color: '#1A1A1A',
                            fontSize: 28,
                            fontWeight: 'bold'
                        }}>
                            {estadisticas.totalEntrenamientos}
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        padding: 15,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2
                    }}>
                        <Text style={{ fontSize: 24, marginBottom: 5 }}>⚡</Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                            Volumen Total
                        </Text>
                        <Text style={{
                            color: Colors.PRIMARY,
                            fontSize: 28,
                            fontWeight: 'bold'
                        }}>
                            {estadisticas.volumenTotal.toLocaleString()}
                        </Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12 }}>kg</Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginBottom: 20
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        padding: 15,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2
                    }}>
                        <Text style={{ fontSize: 24, marginBottom: 5 }}>⏱️</Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                            Tiempo Total
                        </Text>
                        <Text style={{
                            color: Colors.GREEN,
                            fontSize: 28,
                            fontWeight: 'bold'
                        }}>
                            {estadisticas.duracionTotal}
                        </Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12 }}>min</Text>
                    </View>

                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        padding: 15,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2
                    }}>
                        <Text style={{ fontSize: 24, marginBottom: 5 }}>📅</Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                            Promedio
                        </Text>
                        <Text style={{
                            color: '#FF9800',
                            fontSize: 28,
                            fontWeight: 'bold'
                        }}>
                            {estadisticas.totalEntrenamientos > 0
                                ? Math.round(estadisticas.duracionTotal / estadisticas.totalEntrenamientos)
                                : 0}
                        </Text>
                        <Text style={{ color: '#7F8C8D', fontSize: 12 }}>min</Text>
                    </View>
                </View>

                {/* Gráficos */}
                {datosGraficos && datosGraficos.labels.length > 0 ? (
                    <>
                        {/* Gráfico de Volumen - BARRAS */}
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            padding: 15,
                            borderRadius: 12,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2
                        }}>
                            <Text style={{
                                color: '#1A1A1A',
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginBottom: 15
                            }}>
                                📊 Volumen Levantado (kg)
                            </Text>
                            <BarChart
                                data={{
                                    labels: datosGraficos.labels,
                                    datasets: [{
                                        data: datosGraficos.volumen.length > 0 
                                            ? datosGraficos.volumen 
                                            : [0]
                                    }]
                                }}
                                width={screenWidth - 60}
                                height={240}
                                yAxisLabel=""
                                yAxisSuffix="kg"
                                chartConfig={{
                                    backgroundColor: '#FFFFFF',
                                    backgroundGradientFrom: '#FFFFFF',
                                    backgroundGradientTo: '#FFFFFF',
                                    decimalPlaces: 0,
                                    color: (opacity) => `rgba(52, 152, 219, ${opacity})`,
                                    labelColor: (opacity) => `rgba(26, 26, 26, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForBackgroundLines: {
                                        strokeDasharray: '',
                                        stroke: '#E0E0E0',
                                        strokeWidth: 1
                                    },
                                    barPercentage: 0.7
                                }}
                                style={{
                                    borderRadius: 16,
                                    marginVertical: 8
                                }}
                                showValuesOnTopOfBars={true}
                                fromZero={true}
                                segments={5}
                            />
                        </View>

                        {/* Gráfico de Entrenamientos - LÍNEA CON PUNTOS */}
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            padding: 15,
                            borderRadius: 12,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2
                        }}>
                            <Text style={{
                                color: '#1A1A1A',
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginBottom: 15
                            }}>
                                🏋️ Frecuencia de Entrenamientos
                            </Text>
                            <LineChart
                                data={{
                                    labels: datosGraficos.labels,
                                    datasets: [{
                                        data: datosGraficos.entrenamientos.length > 0 
                                            ? datosGraficos.entrenamientos 
                                            : [0],
                                        color: (opacity) => `rgba(57, 185, 129, ${opacity})`,
                                        strokeWidth: 3
                                    }]
                                }}
                                width={screenWidth - 60}
                                height={240}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={{
                                    backgroundColor: '#FFFFFF',
                                    backgroundGradientFrom: '#FFFFFF',
                                    backgroundGradientTo: '#FFFFFF',
                                    decimalPlaces: 0,
                                    color: (opacity) => `rgba(57, 185, 129, ${opacity})`,
                                    labelColor: (opacity) => `rgba(26, 26, 26, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: '7',
                                        strokeWidth: '3',
                                        stroke: '#39b981',
                                        fill: '#FFFFFF'
                                    },
                                    propsForBackgroundLines: {
                                        strokeDasharray: '',
                                        stroke: '#E0E0E0',
                                        strokeWidth: 1
                                    }
                                }}
                                bezier
                                style={{
                                    borderRadius: 16,
                                    marginVertical: 8
                                }}
                                fromZero={true}
                                segments={5}
                            />
                        </View>
                    </>
                ) : (
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        padding: 20,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 200,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: '#E0E0E0'
                    }}>
                        <Text style={{ fontSize: 48, marginBottom: 10 }}>📈</Text>
                        <Text style={{
                            color: '#7F8C8D',
                            fontSize: 16,
                            textAlign: 'center',
                            lineHeight: 24
                        }}>
                            Los gráficos aparecerán aquí una vez que completes tus primeros entrenamientos
                        </Text>
                    </View>
                )}

                {/* Info */}
                <View style={{
                    backgroundColor: '#E3F2FD',
                    padding: 15,
                    borderRadius: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.PRIMARY
                }}>
                    <Text style={{ color: '#1A1A1A', fontSize: 14, lineHeight: 20 }}>
                        💡 <Text style={{ fontWeight: 'bold' }}>Consejo:</Text> Completa tus rutinas regularmente para ver tu progreso y estadísticas detalladas.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
