import { View, Text, TextInput } from 'react-native'
import React from 'react'

export default function Input({
  placeholder, 
  password=false, 
  onChangeText, 
  label='', 
  value='',
  keyboardType='default',
  inputType='text' // 'text', 'number', 'decimal', 'email'
}) {
  
  const handleChangeText = (text) => {
    let validatedText = text;
    
    // Validación según el tipo de input
    switch(inputType) {
      case 'number':
        // Solo permite números enteros
        validatedText = text.replace(/[^0-9]/g, '');
        break;
      case 'decimal':
        // Permite números con decimales (punto o coma)
        validatedText = text.replace(/[^0-9.,]/g, '').replace(',', '.');
        // Asegurar solo un punto decimal
        const parts = validatedText.split('.');
        if (parts.length > 2) {
          validatedText = parts[0] + '.' + parts.slice(1).join('');
        }
        break;
      case 'email':
        // Permite caracteres válidos para email
        validatedText = text.trim();
        break;
      case 'text':
      default:
        // Permite todo tipo de caracteres incluyendo números y letras
        validatedText = text;
        break;
    }
    
    onChangeText(validatedText);
  }

  return (
    <View style={{
      marginTop: 15,
      width: '100%'
    }}>
      <Text style={{
        fontWeight: 'medium',
        fontSize: 18
      }}>{label}</Text>
      <TextInput 
        placeholder={placeholder}
        secureTextEntry={password}
        onChangeText={handleChangeText}
        value={value}
        keyboardType={keyboardType}
        style={{
          padding: 15,
          borderWidth: 1,
          borderRadius: 10,
          fontSize: 18,
          paddingVertical: 20,
          width: '100%',
          marginTop: 2
        }}
      />
    </View>
  )
}