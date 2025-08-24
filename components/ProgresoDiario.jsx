import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import moment from 'moment'
import Colors from '../shared/Colors'
import { UserContext } from '../context/UserContext'

export default function TodayProgress() {
    const {user}=useContext(UserContext)
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

            <Text style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 10,
                color: Colors.PRIMARY
            }}>1500/{user?.calorias} Calorías</Text>
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
                    width: '75%'
                }}>
                </View>
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
        </View>
    )
}