import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import Colors from '../shared/Colors';
import Button from './shared/Button';

export default function PlanComidaDiario() {
    const [planComida, setPlanComida] = useState();
    return (
        <View style={{
            marginTop: 15
        }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold'
            }}>Plan de Comida diario</Text>


            {!planComida && 
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: Colors.WHITE,
                    marginTop: 15,
                    borderRadius: 15
                }}>
                    <HugeiconsIcon icon={Calendar03Icon} size={40} color={Colors.PRIMARY}/>
                    <Text style={{
                        fontSize: 18,
                        color: Colors.GRAY,
                        marginBottom: 20
                    }}>No tienes ningun plan por hoy</Text>

                    <Button title={'Crear Plan de Comida'}/>
                </View>
            }
        </View>
    )
}