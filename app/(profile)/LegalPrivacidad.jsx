import { View, Text, FlatList } from 'react-native';
import React from 'react';
import Colors from '../../shared/Colors';

const legalText = [
  '1. Introducción: Esta aplicación recopila y procesa datos personales conforme a la legislación vigente.',
  '2. Uso de datos: Los datos se utilizan exclusivamente para mejorar la experiencia del usuario y no se comparten con terceros sin consentimiento.',
  '3. Seguridad: Implementamos medidas de seguridad para proteger la información personal de accesos no autorizados.',
  '4. Privacidad: El usuario puede solicitar la eliminación de sus datos en cualquier momento.',
  '5. Cookies: La app puede utilizar cookies para optimizar el funcionamiento y personalización.',
  '6. Modificaciones: Nos reservamos el derecho de modificar esta política en cualquier momento. Se notificará a los usuarios sobre cambios importantes.',
  '7. Contacto: Para dudas o solicitudes sobre privacidad, contactar a soporte@fitnessapp.com.',
  // Puedes agregar más secciones o texto aquí según lo que requieras
];

export default function LegalPrivacidad() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
        Legal y Privacidad
      </Text>
      <FlatList
        data={legalText}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, color: Colors.GRAY, marginBottom: 15, lineHeight: 22 }}>
            {item}
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}