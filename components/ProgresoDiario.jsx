import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import Colors from '../shared/Colors'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { ArrowUp01Icon } from '@hugeicons/core-free-icons';
import { UserContext } from '../context/UserContext'
import { useConvex } from 'convex/react'
import { api } from './../convex/_generated/api'
import { RefreshDataContext } from '../context/RefreshDataContext'

export default function TodayProgress() {
    const [showMacros, setShowMacros] = useState(false);
    const {user}=useContext(UserContext)
    const convex= useConvex();
    const [macrosConsumidos, setMacrosConsumidos] = useState({
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0
    });
    const {refreshData, setRefreshData} = useContext(RefreshDataContext);
    useEffect(()=>{
        user && GetTotalCaloriasConsumidas()
    },[user,refreshData])

    const GetTotalCaloriasConsumidas = async () => {
        const result = await convex.query(api.PlanAlimenticio.GetTotalCaloriasConsumidas, {
            fecha: moment().format('DD/MM/YYYY'),
            uid: user?._id
        });
        setMacrosConsumidos(result);
    }

    return (
        <View style={{
            marginTop: 15,
            padding: 15,
            backgroundColor: Colors.WHITE,
            borderRadius: 10
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>Objetivo de hoy</Text>
                <Text style={{
                    fontSize: 18
                }}>{moment().format('DD MMM,yyyy')}</Text>
            </View>

            {/* Calorías */}
            <Text style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 10,
                color: Colors.PRIMARY
            }}>{macrosConsumidos.calorias}/{user?.calorias} Calorías</Text>
            <Text style={{
                fontSize: 18,
                textAlign: 'center',
                marginTop: 2
            }}>Vamos que se puede!</Text>
            <View style={{
                backgroundColor: Colors.GRAY,
                height: 10,
                borderRadius: 9,
                marginTop: 15,
                opacity: 0.7
            }}>
                <View style={{
                    backgroundColor: Colors.PRIMARY,
                    height: 10,
                    borderRadius: 9,
                    width: `${user?.calorias ? Math.min(100, (macrosConsumidos.calorias / user.calorias) * 100) : 0}%`
                }} />
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5
            }}>
                <Text>Calorías ingeridas</Text>
                <Text>Sigue así!</Text>
            </View>

            {/* Bloque desplegable de macronutrientes */}
            <View style={{
                marginTop: 20,
                borderRadius: 15,
                backgroundColor: Colors.WHITE,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                borderWidth: 1,
                borderColor: Colors.GRAY,
                padding: 0
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 15,
                        borderRadius: 15,
                    }}
                    onPress={() => setShowMacros(!showMacros)}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.PRIMARY }}>Macronutrientes</Text>
                    <HugeiconsIcon
                        icon={showMacros ? ArrowUp01Icon : ArrowDown01Icon}
                        size={28}
                        color={Colors.PRIMARY}
                    />
                </TouchableOpacity>
                {showMacros && (
                    <View style={{ padding: 15, paddingTop: 0 }}>
                        {/* Proteínas */}
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 10,
                            color: Colors.PRIMARY
                        }}>{macrosConsumidos.proteinas}/{user?.proteinas} Proteínas (gr)</Text>
                        <View style={{
                            backgroundColor: Colors.GRAY,
                            height: 10,
                            borderRadius: 9,
                            marginTop: 5,
                            opacity: 0.7
                        }}>
                            <View style={{
                                backgroundColor: Colors.SECONDARY,
                                height: 10,
                                borderRadius: 9,
                                width: `${user?.proteinas ? Math.min(100, (macrosConsumidos.proteinas / user.proteinas) * 100) : 0}%`
                            }} />
                        </View>
                        {/* Carbohidratos */}
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 15,
                            color: Colors.PRIMARY
                        }}>{macrosConsumidos.carbohidratos}/{user?.carbohidratos} Carbohidratos (gr)</Text>
                        <View style={{
                            backgroundColor: Colors.GRAY,
                            height: 10,
                            borderRadius: 9,
                            marginTop: 5,
                            opacity: 0.7
                        }}>
                            <View style={{
                                backgroundColor: Colors.SECONDARY,
                                height: 10,
                                borderRadius: 9,
                                width: `${user?.carbohidratos ? Math.min(100, (macrosConsumidos.carbohidratos / user.carbohidratos) * 100) : 0}%`
                            }} />
                        </View>
                        {/* Grasas */}
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 15,
                            color: Colors.PRIMARY
                        }}>{macrosConsumidos.grasas}/{user?.grasas} Grasas (gr)</Text>
                        <View style={{
                            backgroundColor: Colors.GRAY,
                            height: 10,
                            borderRadius: 9,
                            marginTop: 5,
                            opacity: 0.7
                        }}>
                            <View style={{
                                backgroundColor: Colors.SECONDARY,
                                height: 10,
                                borderRadius: 9,
                                width: `${user?.grasas ? Math.min(100, (macrosConsumidos.grasas / user.grasas) * 100) : 0}%`
                            }} />
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}