import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/shared/Colors'

export default function Button({title,onPress, icon}) {
  return (
    <TouchableOpacity
    onPress={onPress}
    style={{
        padding: 13,
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: 10
    }}>

      <Text style={{
        fontSize: 18,
        color: Colors.WHITE,
        textAlign: 'center'
      }}> {icon} {title}</Text>
    </TouchableOpacity>
  )
}