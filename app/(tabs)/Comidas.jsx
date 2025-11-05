import { View, Text, Platform, FlatList } from 'react-native'
import React, { useContext } from 'react'
import GenerarRecetaCard from '../../components/GenerarRecetaCard'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import RecetasCard from '../../components/RecetasCard'
import { UserContext } from '../../context/UserContext'

export default function Comidas() {

  const { user } = useContext(UserContext)
  const recetasLista = useQuery(
    api.Recetas.GetRecetasPorUsuario, 
    user?._id ? { uid: user._id } : "skip"
  )
  console.log('Comidas: recetasLista', recetasLista)

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
              data={recetasLista ?? []}
              numColumns={2}
              keyExtractor={(item, idx) => item?._id?.toString() || idx.toString()}
              renderItem={({ item }) => (
                <RecetasCard receta={item} />
              )}
            />
          </View>
        </View>}
    />
  )
}