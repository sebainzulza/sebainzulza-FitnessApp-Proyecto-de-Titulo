import { View, Text, Image } from 'react-native'
import React from 'react'
import { HugeiconsIcon} from '@hugeicons/react-native';
import { PlusSignCircleIcon } from '@hugeicons/core-free-icons';
import Colors from '../shared/Colors';

export default function IntroduccionReceta({ recetaDetalle }) {

  const recetaJson = recetaDetalle?.jsonData;
  return (
    <View>
      <Image 
        source={{ uri: recetaDetalle?.imagenUrl }} 
        style={{
          width: '100%',
          height: 200,
          borderRadius:15
        }}
      />

      <View style={{
        marginTop:15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Text style={{
          fontSize:20,
          fontWeight:'bold'
        }}>{recetaDetalle?.recetaNombre}</Text>
        <HugeiconsIcon icon={PlusSignCircleIcon}
        size={40}
        color={Colors.PRIMARY} />

        
      </View>  
      <Text style={{
        fontSize: 16,
        marginTop: 6,
        color: Colors.GRAY,
        lineHeight: 25
      }}>{recetaJson?.descripcion}</Text>
    </View>
  )
}