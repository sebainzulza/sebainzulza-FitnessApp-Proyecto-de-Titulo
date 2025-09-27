import { View, Platform, FlatList } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { UserContext } from './../../context/UserContext'
import { useRouter } from 'expo-router'
import HomeHeader from '../../components/HomeHeader'
import ProgresoDiario from '../../components/ProgresoDiario'
import GenerarRecetaCard from '../../components/GenerarRecetaCard'
import PlanComidaDiario from '../../components/PlanComidaDiario'

export default function Home() {
  const { user } = useContext(UserContext)
  const router = useRouter()
  useEffect(() => {
    if (!user) return;
    if (!user?.peso) {
      router.replace('/preferance')
    }
  }, [user])
  return (
    <FlatList
    data={[]}
    renderItem={()=>null}
    ListHeaderComponent={
    <View style={{
      paddingTop: Platform.OS == 'ios' && 40,
      padding: 20
    }}>
      <HomeHeader />
      <ProgresoDiario />
      <GenerarRecetaCard />
      <PlanComidaDiario />
    </View>}
    ></FlatList>
  )
}