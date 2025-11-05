import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import Colors from './../shared/Colors'

export default function SeleccionFechaCard({setSelectedFecha}) {
    const [fechaList, setFechaList] = useState([]);
    const [selectedFecha_, setSelectedFecha_] = useState();
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
    return (
        <View>
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
                        onPress={() => {setSelectedFecha(item); setSelectedFecha_(item)}}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            padding: 7,
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 5,
                            backgroundColor: selectedFecha_ === item ? Colors.SECONDARY : Colors.WHITE,
                            borderColor: selectedFecha_ === item ? Colors.PRIMARY : Colors.GRAY
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
        </View>
    )
}