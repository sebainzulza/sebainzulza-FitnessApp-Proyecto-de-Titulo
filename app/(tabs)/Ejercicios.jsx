import { View, Text, FlatList, Platform, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import EjercicioCard from '../../components/EjercicioCard'
import ParteCuerpoSelector from '../../components/ParteCuerpoSelector'
import { EjerciciosAPI } from '../../services/EjerciciosAPI'
import Colors from '../../shared/Colors'
import { traducirTexto } from '../../shared/Translations'

export default function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([])
  const [parteSeleccionada, setParteSeleccionada] = useState('back')
  const [cargando, setCargando] = useState(false)
  const router = useRouter();

  // Cargar ejercicios cuando cambie la parte seleccionada
  useEffect(() => {
    cargarEjercicios()
  }, [parteSeleccionada])

  const cargarEjercicios = async () => {
    setCargando(true)
    try {
      const data = await EjerciciosAPI.getEjerciciosPorParteDelCuerpo(parteSeleccionada)
      console.log('Datos recibidos de la API:', data)
      if (data && Array.isArray(data)) {
        setEjercicios(data)
      } else {
        console.log('API no devolvió datos válidos, usando array vacío')
        setEjercicios([])
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
      setEjercicios([]) // Asegurar que siempre sea un array
      Alert.alert(
        'Error',
        'No se pudieron cargar los ejercicios. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      )
    } finally {
      setCargando(false)
    }
  }


  // Simular descripciones breves por parte del cuerpo
  const descripcionesPorParte = {
    back: 'Ejercicio enfocado en fortalecer la espalda. Mantén la postura recta y realiza el movimiento de forma controlada.',
    chest: 'Ejercicio para trabajar el pecho. Concéntrate en la contracción muscular y respira de manera constante.',
    legs: 'Ejercicio para fortalecer las piernas. Realiza el movimiento completo y cuida la técnica.',
    shoulders: 'Ejercicio para hombros. Mantén los codos ligeramente flexionados y controla el peso.',
    arms: 'Ejercicio para brazos. Evita el impulso y enfócate en la contracción.',
    waist: 'Ejercicio para la zona media. Activa el core y mantén la respiración.',
    cardio: 'Ejercicio cardiovascular para mejorar la resistencia y quema de calorías.',
    default: 'Ejercicio para fortalecer el cuerpo. Realiza el movimiento con buena técnica y control.'
  };

  const obtenerDescripcion = (ejercicio) => {
    if (!ejercicio || !ejercicio.bodyPart) return descripcionesPorParte.default;
    const parte = ejercicio.bodyPart.toLowerCase();
    return descripcionesPorParte[parte] || descripcionesPorParte.default;
  };

  const handleEjercicioPress = (ejercicio) => {
    if (!ejercicio) return;
    const descripcion = obtenerDescripcion(ejercicio);
    router.push({
      pathname: '/detalle-ejercicio',
      params: { ejercicio: JSON.stringify(ejercicio), descripcion }
    });
  };

  const renderEjercicio = ({ item }) => {
    if (!item) return null
    return (
      <EjercicioCard 
        ejercicio={item} 
        onPress={handleEjercicioPress}
      />
    )
  }

  const renderHeader = () => (
    <View style={{
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 40 : 30
    }}>
      <Text style={{
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.DARKBLUE,
        marginBottom: 10
      }}>
        Ejercicios
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: Colors.GRAY,
        marginBottom: 15
      }}>
        Descubre ejercicios para cada parte de tu cuerpo
      </Text>

      <ParteCuerpoSelector 
        parteSeleccionada={parteSeleccionada}
        onParteSeleccionada={setParteSeleccionada}
      />

      {cargando && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={{
            marginLeft: 10,
            fontSize: 16,
            color: Colors.GRAY
          }}>
            Cargando ejercicios...
          </Text>
        </View>
      )}
    </View>
  )

  return (
    <FlatList
      data={ejercicios || []}
      renderItem={renderEjercicio}
      numColumns={2}
      keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{
        paddingBottom: 20
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}