import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Colors from '../shared/Colors';

export default function RecetaPasos({recetaDetalle}) {
    const pasos = (recetaDetalle?.pasos || recetaDetalle?.jsonData?.pasos) || [];
    return (
        <View style={{
            marginTop: 15
        }}>
            <Text>Instrucciones</Text>
            <FlatList
                data={pasos}
                renderItem={({item, index}) => (
                    <View style={{
                        display:'flex',
                        flexDirection:'row',
                        gap: 10,
                        marginTop: 10,
                        padding: 10,
                        flex: 1,
                        alignItems:'center',
                        borderWidth: 0.3,
                        borderRadius: 15
                    }}>
                        <Text style={{
                            fontSize: 15,
                            backgroundColor: Colors.PRIMARY,
                            padding: 10,
                            borderRadius: 99,
                            paddingHorizontal: 15,
                            color: Colors.WHITE
                        }}>{index+1}</Text>
                        <Text style={{
                            fontSize: 16,
                            flex: 1,
                            flexShrink: 1
                        }}>{item}</Text>
                    </View>
                )}
            />
        </View>
    )
}