import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { UserContext } from './../../context/UserContext'
import { useRouter } from 'expo-router'

export default function Home() {
  const {user}=useContext(UserContext)
  const router=useRouter()
  useEffect(()=>{
    if(!user?.peso)
    {
      router.replace('/preferance')
    }
  })
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}