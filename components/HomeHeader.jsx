import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'

export default function HomeHeader() {
  const {user}= useContext(UserContext)
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    }}>
      <Image source={require('./../assets/images/user.jpg')}
      style={{
        width: 100,
        height: 100,
        borderRadius: 50
      }}
      />
      <View>
        <Text style={{
          fontSize: 25,
          fontWeight: 'bold' 
        }}>Hola {user?.name}!</Text>
        <Text style={{
          fontSize: 16
        }}>Siempre es bueno tenerte de vuelta 🫂</Text>
      </View>
    </View>
  )
}