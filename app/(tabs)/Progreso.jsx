import { View, Text, Platform, FlatList } from 'react-native'
import SeleccionFechaCard from './../../components/SeleccionFechaCard'
import React, { useState } from 'react'
import PlanComidaDiario from '../../components/PlanComidaDiario';
import ProgresoDiario from '../../components/ProgresoDiario';

export default function Progress() {
  const [selectedFecha, setSelectedFecha] = useState();
  return (
    <FlatList
    data={[]}
    renderItem={() => null}
    ListHeaderComponent={
    <View style={{
      padding: 20,
      paddingTop: Platform?.OS == 'ios' ? 40 : 25
    }}>
      <Text style={{
        fontSize: 25,
        fontWeight: 'bold'
      }}>Progreso Diario</Text>

      <SeleccionFechaCard setSelectedFecha={setSelectedFecha}/>
      <ProgresoDiario />

      <Text style={{
        fontSize: 25,
        fontWeight: 'bold'
      }}>Progreso semanal/mensual</Text>
    </View>}/>
  )
}