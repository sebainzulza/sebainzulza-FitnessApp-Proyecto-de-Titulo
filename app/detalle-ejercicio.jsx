import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import Colors from '../shared/Colors';
import { traducirTexto } from '../shared/Translations';
import { useLocalSearchParams } from 'expo-router';

export default function DetalleEjercicio(props) {
  // Soportar ambos: route.params (stack) y useLocalSearchParams (expo-router)
  let ejercicio, descripcion;
  if (props.route && props.route.params) {
    ({ ejercicio, descripcion } = props.route.params);
  } else {
    const params = useLocalSearchParams();
    ejercicio = params.ejercicio;
    descripcion = params.descripcion;
  }
  if (typeof ejercicio === 'string') {
    try {
      ejercicio = JSON.parse(ejercicio);
    } catch {
      ejercicio = {};
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: ejercicio.gifUrl }}
        style={styles.gif}
        resizeMode="cover"
      />
      <Text style={styles.nombre}>{ejercicio.name}</Text>
      <Text style={styles.descripcion}>{descripcion}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.info}><Text style={styles.label}>Parte del cuerpo: </Text>{traducirTexto(ejercicio.bodyPart)}</Text>
        <Text style={styles.info}><Text style={styles.label}>Equipo: </Text>{traducirTexto(ejercicio.equipment)}</Text>
        <Text style={styles.info}><Text style={styles.label}>Músculo objetivo: </Text>{traducirTexto(ejercicio.target)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.WHITE,
    flexGrow: 1,
  },
  gif: {
    width: 260,
    height: 260,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: Colors.SECONDARY,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.DARKBLUE,
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  descripcion: {
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.SECONDARY,
  },
  info: {
    fontSize: 15,
    color: Colors.DARKBLUE,
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
});
