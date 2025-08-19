import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Home07Icon, WorkoutGymnasticsIcon, SpoonAndForkIcon, Chart03Icon, UserIcon } from '@hugeicons/core-free-icons';
import Colors from './../../shared/Colors';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.PRIMARY
    }}>
        <Tabs.Screen name='Home' options={{
          tabBarIcon:({color,size})=>
            <HugeiconsIcon
            icon={Home07Icon}
            size={size}
            color={color}
            strokeWidth={1.5}
          />
        }}/>
        <Tabs.Screen name='Ejercicios' options={{
          tabBarIcon:({color,size})=>
            <HugeiconsIcon
            icon={WorkoutGymnasticsIcon}
            size={size}
            color={color}
            strokeWidth={1.5}
          />
        }}/>
        <Tabs.Screen name='Comidas' options={{
          tabBarIcon:({color,size})=>
            <HugeiconsIcon
            icon={SpoonAndForkIcon}
            size={size}
            color={color}
            strokeWidth={1.5}
          />
        }}/>
        <Tabs.Screen name='Progreso' options={{
          tabBarIcon:({color,size})=>
            <HugeiconsIcon
            icon={Chart03Icon}
            size={size}
            color={color}
            strokeWidth={1.5}
          />
        }}/>
        <Tabs.Screen name='Perfil' options={{
          tabBarIcon:({color,size})=>
            <HugeiconsIcon
            icon={UserIcon}
            size={size}
            color={color}
            strokeWidth={1.5}
          />
        }}/>
    </Tabs>
  )
}