import { View, Text, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import Colors from '../shared/Colors';
import Button from './shared/Button';
import { useConvex } from 'convex/react';
import { api } from '../convex/_generated/api';
import moment from 'moment';
import { UserContext } from '../context/UserContext';
import PlanAlimenticioCard from './PlanAlimenticioCard';
import { RefreshDataContext } from '../context/RefreshDataContext';
import { useRouter } from 'expo-router';

export default function PlanComidaDiario({selectedFecha = null}) {
    const [planComida, setPlanComida] = useState();
    const {user} = useContext(UserContext);
    const convex = useConvex();
    const {refreshData, setRefreshData} = useContext(RefreshDataContext);
    const router = useRouter();

    useEffect(()=>{
        user && GetPlanComidaHoy();
    },[user,refreshData])

    const GetPlanComidaHoy = async () => {
        const fechaAUsar = selectedFecha || moment().format('DD/MM/YYYY');
        console.log("Obteniendo plan para fecha:", fechaAUsar, "Usuario:", user?._id);
        
        const result = await convex.query(api.PlanAlimenticio.GetPlanAlimenticioHoy,{
            fecha: fechaAUsar,
            uid: user?._id
        });
        console.log("Plan alimenticio obtenido:", result);

        setPlanComida(result);
    }

    return (
        <View style={{
            marginTop: 15
        }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold'
            }}>Plan de Comida diario</Text>


            {!planComida || planComida.length === 0 ? 
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

                    <Button title={'Crear Plan de Comida'} onPress={() => router.push('/generar-receta-IA')}/>
                </View>
                :<View>
                    <FlatList
                        data={planComida}
                        renderItem={({item})=>(
                            <PlanAlimenticioCard planAlimenticioInfo={item}/>
                        )}
                    />
                </View>
            }
        </View>
    )
}