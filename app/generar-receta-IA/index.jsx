import { View, Text, Platform, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Colors from './../../shared/Colors'
import Button from './../../components/shared/Button'
import { GenerarIAReceta } from '../../services/AiModel'
import Prompt from '../../shared/Prompt'
import ListaRecetaOpciones from '../../components/ListaRecetaOpciones'

export default function GenerarRecetaIA() {

    const [input, setInput]=useState()
    const [loading, setLoading]=useState(false)
        const [recetaOpcion, setRecetaOpcion]=useState([])
    const GenerarRecetaOpciones=async()=>{
        setLoading(true);
        
        try {
            const PROMPT = input + Prompt.GENERAR_RECETA_OPCION_PROMPT;
            const recetas = await GenerarIAReceta(PROMPT);
            if (Array.isArray(recetas)) {
                setRecetaOpcion(recetas);
            } else {
                setRecetaOpcion([]);
            }
        } catch (e) {
            setRecetaOpcion([]);
        } finally {
            setLoading(false);
        }
    }

    // ...existing code...
    return (
        <View style={{
            paddingTop: Platform.OS == 'ios' ? 40 : 30,
            padding: 20,
            backgroundColor: Colors.WHITE,
            height: '100%'
        }}>
            <Text style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center'
            }}>Generador de Receta con IA</Text>
            <Text style={{
                marginTop: 5,
                color: Colors.GRAY,
                fontSize: 16
            }}>Genera recetas personalizadas usando IA</Text>

            <TextInput
            style={styles.textArea}
            onChangeText={(value)=>setInput(value)}
            placeholder='Ingresa tus ingredientes o idea de receta'/>

            <View style={{
                marginTop: 25
            }}>
                <Button title={'Generar receta'}
                onPress={GenerarRecetaOpciones}
                loading={loading}
                />
            </View>

            {recetaOpcion?.length> 0 &&<ListaRecetaOpciones recetaOpcion={recetaOpcion}/>}

        </View>
    )
}

const styles = StyleSheet.create({
    textArea:{
                padding: 15,
                borderWidth: 1,
                borderRadius: 10,
                fontSize: 20,
                marginTop: 15,
                height: 200,
                height: 150,
                textAlignVertical: 'top',
                backgroundColor: Colors.WHITE
            }
})