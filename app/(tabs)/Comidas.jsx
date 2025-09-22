import { View, Text, Platform, FlatList } from 'react-native'
import React, { use } from 'react'
import GenerarRecetaCard from '../../components/GenerarRecetaCard'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import RecetasCard from '../../components/RecetasCard'

export default function Comidas() {

  const recetasLista = useQuery(api.Recetas.GetTodasLasRecetas)
  console.log(recetasLista)

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <View style={{
          padding: 20,
          paddingTop: Platform.OS === 'ios' ? 40 : 30
        }}>
          <Text style={{
            fontSize: 25,
            fontWeight: 'bold'
          }}>Descubrir recetas/Ingresar alimentos</Text>

          <GenerarRecetaCard />

          <View>
            <FlatList
              data={recetasLista}
              numColumns={2}
              renderItem={({ item }) => (
                <RecetasCard receta={item} />
              )}
            />
          </View>
        </View>}
    />
  )
}