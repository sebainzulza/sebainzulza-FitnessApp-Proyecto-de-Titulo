import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { PlusSignCircleIcon, FireIcon, Timer01Icon, UserGroupIcon, ChickenThighsIcon } from '@hugeicons/core-free-icons';
import Colors from '../shared/Colors';

export default function IntroduccionReceta({ recetaDetalle }) {
  const recetaJson = recetaDetalle?.jsonData || recetaDetalle;
  return (
    <View>
      <View style={{
        marginTop:15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Text style={{
          fontSize:20,
          fontWeight:'bold'
        }}>{recetaDetalle?.recetaNombre || recetaJson?.recetaNombre}</Text>
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



      <View style={{
        marginTop:15,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        gap: 10
      }}>
        <View style={styles.propertiesContainer}>
          <HugeiconsIcon icon={FireIcon} color={Colors.PRIMARY}
          size={30}/>
          <Text style={styles.subText}>Calorías</Text>
          <Text style={styles.counts}>{recetaJson?.calorias}</Text>
        </View>
        <View style={styles.propertiesContainer}>
          <HugeiconsIcon icon={ChickenThighsIcon} color={Colors.PRIMARY}
          size={30}/>
          <Text style={styles.subText}>Proteínas</Text>
          <Text style={styles.counts}>{recetaJson?.proteinas}</Text>
        </View>
        <View style={styles.propertiesContainer}>
          <HugeiconsIcon icon={Timer01Icon} color={Colors.PRIMARY}
          size={30}/>
          <Text style={styles.subText}>Tiempo</Text>
          <Text style={styles.counts}>{recetaJson?.tiempoPreparacion}</Text>
        </View>
        <View style={styles.propertiesContainer}>
          <HugeiconsIcon icon={UserGroupIcon} color={Colors.PRIMARY}
          size={30}/>
          <Text style={styles.subText}>Porciones</Text>
          <Text style={styles.counts}>{recetaJson?.servirA}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  iconBg:{
    padding:6,
  },
  propertiesContainer:{
    display:'flex',
    alignItems:'center',
    backgroundColor: '#fbf5ff',
    padding: 6,
    borderRadius: 10,
    flex:1
  },  
  subText:{
    fontSize: 16
  },
  counts:{
    fontSize: 20,
    color: Colors.PRIMARY,
    fontWeight: 'bold'
  }
})