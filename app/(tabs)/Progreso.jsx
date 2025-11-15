import { View, Text, Platform, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useContext, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { UserContext } from '../../context/UserContext'
import ProgresoDiario from '../../components/ProgresoDiario'
import Colors from '../../shared/Colors'
import { LineChart, BarChart } from 'react-native-chart-kit'
import moment from 'moment'
import 'moment/locale/es'

export default function Progress() {
  const { user } = useContext(UserContext)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('semana')
  
  moment.locale('es')
  const screenWidth = Dimensions.get('window').width

  // Calcular fechas según periodo
  const calcularFechas = () => {
    const hoy = moment()
    let fechaInicio, fechaFin

    switch (periodoSeleccionado) {
      case 'dia':
        fechaInicio = hoy.clone().startOf('day')
        fechaFin = hoy.clone().endOf('day')
        break
      case 'semana':
        fechaInicio = hoy.clone().startOf('week')
        fechaFin = hoy.clone().endOf('week')
        break
      case 'mes':
        fechaInicio = hoy.clone().startOf('month')
        fechaFin = hoy.clone().endOf('month')
        break
      case 'anual':
        fechaInicio = hoy.clone().startOf('year')
        fechaFin = hoy.clone().endOf('year')
        break
      default:
        fechaInicio = hoy.clone().startOf('week')
        fechaFin = hoy.clone().endOf('week')
    }

    return {
      fechaInicio: fechaInicio.format('DD/MM/YYYY'),
      fechaFin: fechaFin.format('DD/MM/YYYY')
    }
  }

  const { fechaInicio, fechaFin } = calcularFechas()

  // Obtener estadísticas
  const estadisticas = useQuery(
    api.PlanAlimenticio.GetEstadisticasAlimenticiasPorPeriodo,
    user ? {
      uid: user._id,
      fechaInicio,
      fechaFin
    } : "skip"
  )

  const PERIODOS = [
    { id: 'dia', label: 'Día', emoji: '📅' },
    { id: 'semana', label: 'Semana', emoji: '📆' },
    { id: 'mes', label: 'Mes', emoji: '🗓️' },
    { id: 'anual', label: 'Año', emoji: '📊' }
  ]

  // Preparar datos para gráficos
  const datosGraficos = useMemo(() => {
    if (!estadisticas || !estadisticas.porFecha || Object.keys(estadisticas.porFecha).length === 0) {
      return null
    }

    const fechasOrdenadas = Object.keys(estadisticas.porFecha).sort((a, b) => {
      const [diaA, mesA, anioA] = a.split('/')
      const [diaB, mesB, anioB] = b.split('/')
      return new Date(`${anioA}-${mesA}-${diaA}`) - new Date(`${anioB}-${mesB}-${diaB}`)
    })

    return {
      labels: fechasOrdenadas.map(f => {
        const [dia, mes] = f.split('/')
        return `${dia}/${mes}`
      }).slice(-7),
      calorias: fechasOrdenadas.map(f => estadisticas.porFecha[f].calorias).slice(-7),
      comidas: fechasOrdenadas.map(f => estadisticas.porFecha[f].comidas).slice(-7)
    }
  }, [estadisticas])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{
        padding: 20,
        paddingTop: Platform?.OS == 'ios' ? 40 : 25
      }}>
        {/* Header */}
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1A1A1A'
        }}>Progreso Nutricional</Text>
        <Text style={{
          fontSize: 14,
          color: '#7F8C8D',
          marginTop: 5,
          marginBottom: 15
        }}>Seguimiento de tu alimentación</Text>

        {/* Progreso Diario */}
        <ProgresoDiario />

        {/* Separador */}
        <View style={{
          height: 1,
          backgroundColor: '#E0E0E0',
          marginVertical: 25
        }} />

        {/* Filtros de Periodo */}
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: '#1A1A1A',
          marginBottom: 15
        }}>Análisis por Periodo</Text>

        <View style={{
          flexDirection: 'row',
          gap: 10,
          marginBottom: 20
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
                  : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: periodoSeleccionado === periodo.id ? Colors.PRIMARY : '#E0E0E0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2
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

        {/* Tarjetas de estadísticas */}
        {estadisticas && (
          <>
            <View style={{
              flexDirection: 'row',
              gap: 10,
              marginBottom: 10
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
                <Text style={{ fontSize: 24, marginBottom: 5 }}>🔥</Text>
                <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                  Calorías Totales
                </Text>
                <Text style={{
                  color: Colors.PRIMARY,
                  fontSize: 26,
                  fontWeight: 'bold'
                }}>
                  {estadisticas.totalCalorias?.toLocaleString() || 0}
                </Text>
                <Text style={{ color: '#7F8C8D', fontSize: 11 }}>kcal</Text>
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
                <Text style={{ fontSize: 24, marginBottom: 5 }}>🍽️</Text>
                <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                  Comidas
                </Text>
                <Text style={{
                  color: Colors.GREEN,
                  fontSize: 26,
                  fontWeight: 'bold'
                }}>
                  {estadisticas.totalComidas || 0}
                </Text>
                <Text style={{ color: '#7F8C8D', fontSize: 11 }}>registradas</Text>
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
                <Text style={{ fontSize: 24, marginBottom: 5 }}>📈</Text>
                <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                  Promedio/Día
                </Text>
                <Text style={{
                  color: '#FF9800',
                  fontSize: 26,
                  fontWeight: 'bold'
                }}>
                  {estadisticas.diasConDatos > 0
                    ? Math.round(estadisticas.totalCalorias / estadisticas.diasConDatos)
                    : 0}
                </Text>
                <Text style={{ color: '#7F8C8D', fontSize: 11 }}>kcal/día</Text>
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
                <Text style={{ fontSize: 24, marginBottom: 5 }}>💪</Text>
                <Text style={{ color: '#7F8C8D', fontSize: 12, marginBottom: 5 }}>
                  Proteínas
                </Text>
                <Text style={{
                  color: '#E91E63',
                  fontSize: 26,
                  fontWeight: 'bold'
                }}>
                  {Math.round(estadisticas.totalProteinas || 0)}
                </Text>
                <Text style={{ color: '#7F8C8D', fontSize: 11 }}>gramos</Text>
              </View>
            </View>

            {/* Gráficos */}
            {datosGraficos && datosGraficos.labels.length > 0 ? (
              <>
                {/* Gráfico de Calorías */}
                <View style={{
                  backgroundColor: '#FFFFFF',
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 15,
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
                    🔥 Calorías Consumidas (kcal)
                  </Text>
                  <BarChart
                    data={{
                      labels: datosGraficos.labels,
                      datasets: [{
                        data: datosGraficos.calorias.length > 0 
                          ? datosGraficos.calorias 
                          : [0]
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

                {/* Gráfico de Comidas */}
                <View style={{
                  backgroundColor: '#FFFFFF',
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 15,
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
                    🍽️ Comidas Registradas
                  </Text>
                  <LineChart
                    data={{
                      labels: datosGraficos.labels,
                      datasets: [{
                        data: datosGraficos.comidas.length > 0 
                          ? datosGraficos.comidas 
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
                <Text style={{ fontSize: 48, marginBottom: 10 }}>📊</Text>
                <Text style={{
                  color: '#7F8C8D',
                  fontSize: 16,
                  textAlign: 'center',
                  lineHeight: 24
                }}>
                  Aún no hay datos suficientes para mostrar gráficos. ¡Sigue registrando tus comidas!
                </Text>
              </View>
            )}

            {/* Info */}
            <View style={{
              backgroundColor: '#E3F2FD',
              padding: 15,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: Colors.PRIMARY,
              marginBottom: 20
            }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, lineHeight: 20 }}>
                💡 <Text style={{ fontWeight: 'bold' }}>Consejo:</Text> Marca tus comidas como completadas para ver tu progreso en las estadísticas.
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}