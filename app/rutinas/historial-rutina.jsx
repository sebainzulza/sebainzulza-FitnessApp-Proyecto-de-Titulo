import { View, Text, FlatList, Platform, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { UserContext } from '../../context/UserContext'
import Colors from '../../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { ArrowLeft01Icon, Calendar03Icon, Timer01Icon, TrophyIcon, DumbbellIcon } from '@hugeicons/core-free-icons'
import moment from 'moment'
import 'moment/locale/es'

export default function HistorialRutina() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { user } = useContext(UserContext)
    
    const rutina = useQuery(
        api.Rutinas.ObtenerRutinaPorId,
        params.rutinaId ? { id: params.rutinaId } : "skip"
    )
    
    const historial = useQuery(
        api.Rutinas.ObtenerHistorialRutinas,
        user?._id && params.rutinaId 
            ? { uid: user._id, rutinaId: params.rutinaId } 
            : "skip"
    )

    moment.locale('es')

    const renderHistorialItem = ({ item }) => {
        const totalSeries = item.ejerciciosRealizados.reduce((acc, ej) => 
            acc + ej.seriesCompletadas.length, 0
        )
        const seriesCompletadas = item.ejerciciosRealizados.reduce((acc, ej) => 
            acc + ej.seriesCompletadas.filter(s => s.completada).length, 0
        )

        return (
            <View style={{
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <HugeiconsIcon icon={Calendar03Icon} size={20} color={Colors.PRIMARY} />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                            {moment(item.fecha, 'DD/MM/YYYY').format('DD MMM YYYY')}
                        </Text>
                    </View>
                    
                    {item.completada && (
                        <View style={{
                            backgroundColor: '#4CAF50',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 12
                        }}>
                            <Text style={{ color: Colors.WHITE, fontSize: 12, fontWeight: 'bold' }}>
                                ✓ Completada
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <HugeiconsIcon icon={Timer01Icon} size={18} color={Colors.GRAY} />
                        <Text style={{ color: Colors.GRAY, fontSize: 14 }}>
                            {item.duracion} min
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <HugeiconsIcon icon={TrophyIcon} size={18} color={Colors.GRAY} />
                        <Text style={{ color: Colors.GRAY, fontSize: 14 }}>
                            {seriesCompletadas}/{totalSeries} series
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <HugeiconsIcon icon={DumbbellIcon} size={18} color={Colors.GRAY} />
                        <Text style={{ color: Colors.GRAY, fontSize: 14 }}>
                            {item.volumenTotal} kg total
                        </Text>
                    </View>
                </View>

                <Text style={{ 
                    color: Colors.GRAY, 
                    fontSize: 12, 
                    marginTop: 8,
                    fontStyle: 'italic'
                }}>
                    Hace {moment(item.fecha, 'DD/MM/YYYY').fromNow()}
                </Text>
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
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ marginBottom: 15 }}
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={Colors.DARKBLUE} />
                </TouchableOpacity>
                
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.DARKBLUE }}>
                    Historial
                </Text>
                <Text style={{ fontSize: 16, color: Colors.GRAY, marginTop: 5 }}>
                    {rutina?.nombreRutina}
                </Text>
                <Text style={{ fontSize: 14, color: Colors.GRAY, marginTop: 2 }}>
                    {historial?.length || 0} sesiones realizadas
                </Text>
            </View>

            <FlatList
                data={historial || []}
                renderItem={renderHistorialItem}
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
                        <HugeiconsIcon icon={Calendar03Icon} size={60} color={Colors.GRAY} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: Colors.GRAY,
                            marginTop: 20,
                            textAlign: 'center'
                        }}>
                            Sin historial
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.GRAY,
                            marginTop: 10,
                            textAlign: 'center'
                        }}>
                            Aún no has realizado esta rutina
                        </Text>
                    </View>
                }
            />
        </View>
    )
}
