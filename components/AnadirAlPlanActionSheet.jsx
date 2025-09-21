import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import Colors from '../shared/Colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Sun03FreeIcons, SunriseFreeIcons, SunsetFreeIcons } from '@hugeicons/core-free-icons';
import Button from './shared/Button';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { UserContext } from './../context/UserContext';

export default function AnadirAlPlanActionSheet({recetaDetalle, hideActionSheet}) {

    const [fechaList, setFechaList] = useState([]);
    const [selectedFecha, setSelectedFecha] = useState();
    const [selectedComida, setSelectedComida] = useState();
    const {user} = useContext(UserContext)
    const CrearPlanAlimenticio = useMutation(api.PlanAlimenticio.CrearPlanAlimenticio)
    const router = useRouter();

    const comidaOpciones = [
        {
            title: 'Desayuno',
            icon: SunriseFreeIcons
        },
        {
            title: 'Almuerzo',
            icon: Sun03FreeIcons
        },
        {
            title: 'Cena',
            icon: SunsetFreeIcons
        },
    ];
    useEffect(() => {
        GenerarFechas();
    }, [])

    const GenerarFechas = () => {
        const resultado = [];
        for (let i = 0; i < 4; i++) {
            const siguienteFecha = moment().add(i, 'days').format('DD/MM/YYYY');
            resultado.push(siguienteFecha);
        }
        console.log("Fechas generadas:", resultado);
        setFechaList(resultado);
    }

    const AnadirAlPlanAlimenticio = async()=>{
        if(!selectedFecha&&!selectedComida)
        {
            Alert.alert("Error","Por favor selecciona una fecha y un tipo de comida");
            return;
        }

        const result = await CrearPlanAlimenticio({
            fecha: selectedFecha,
            comidaTipo: selectedComida,
            recetaId: recetaDetalle?._id,
            uid: user?._id
        })

        console.log(result)

        Alert.alert("Añadido!","Receta añadida al plan alimenticio");
        hideActionSheet();
        router.push('/(tabs)/Home');
    }

    return (
        <View style={{
            padding: 20
        }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center'
            }}>Añadir al Plan</Text>

            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 15
            }}>Selecciona una fecha</Text>
            <FlatList
                data={fechaList}
                numColumns={4}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedFecha(item)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            padding: 7,
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 5,
                            backgroundColor: selectedFecha == item ? Colors.SECONDARY : Colors.WHITE,
                            borderColor: selectedFecha == item ? Colors.PRIMARY : Colors.GRAY
                        }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '500'
                        }}>{moment(item, 'DD/MM/YYYY').format('ddd')}</Text>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}>{moment(item, 'DD/MM/YYYY').format('DD')}</Text>
                        <Text style={{
                            fontSize: 16
                        }}>{moment(item, 'DD/MM/YYYY').format('MMM')}</Text>
                    </TouchableOpacity>
                )}
            />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 15
            }}>Selecciona horario comida</Text>
            <FlatList
                data={comidaOpciones}
                numColumns={4}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedComida(item?.title)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            padding: 7,
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 5,
                            backgroundColor: selectedComida == item.title ? Colors.SECONDARY : Colors.WHITE,
                            borderColor: selectedComida == item.title ? Colors.PRIMARY : Colors.GRAY
                        }}>
                        <HugeiconsIcon icon={item.icon} />
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={{
                marginTop: 15
            }}>
                <Button title={'+ Añadir al Plan Alimenticio'}
                onPress={AnadirAlPlanAlimenticio}/>
                <TouchableOpacity
                onPress={()=>hideActionSheet()}
                style={{
                    padding: 15
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 20
                    }}>Cancelar</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}