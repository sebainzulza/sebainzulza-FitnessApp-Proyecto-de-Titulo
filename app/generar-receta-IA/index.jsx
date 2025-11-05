import { View, Text, Platform, TextInput, StyleSheet } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Colors from './../../shared/Colors'
import Button from './../../components/shared/Button'
import { GenerarIAReceta } from '../../services/AiModel'
import Prompt from '../../shared/Prompt'
import ListaRecetaOpciones from '../../components/ListaRecetaOpciones'
import { UserContext } from '../../context/UserContext'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Modal, Pressable } from 'react-native'

export default function GenerarRecetaIA() {

    const [input, setInput] = useState();
    const [loading, setLoading] = useState(false);
    const [recetaOpcion, setRecetaOpcion] = useState([]);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const updateUserConsent = useMutation(api.Users.UpdateUserConsent);

    useEffect(() => {
        if (user && !user?.aiDisclaimerAcknowledgedAt) {
            setShowDisclaimer(true);
        }
    }, [user]);
    const GenerarRecetaOpciones = async () => {
        setLoading(true);
        try {
            const PROMPT = input + Prompt.GENERAR_RECETA_OPCION_PROMPT;
            const recetas = await GenerarIAReceta(PROMPT);
            if (Array.isArray(recetas)) {
                setRecetaOpcion(recetas);
            } else {
                setRecetaOpcion([]);
                alert('La respuesta de la IA no es válida.');
            }
        } catch (e) {
            setRecetaOpcion([]);
            alert('Error al generar receta: ' + (e?.message || e));
        } finally {
            setLoading(false);
        }
    }

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

            <Modal visible={showDisclaimer} transparent animationType='fade'>
                <View style={{ flex: 1, backgroundColor: '#00000080', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: Colors.WHITE, padding: 20, borderRadius: 12 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Aviso importante</Text>
                        <Text style={{ color: Colors.GRAY, marginBottom: 15 }}>
                            Los planes y recetas generados por IA son orientativos y no sustituyen el consejo de un profesional de la salud.
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                            <Pressable onPress={() => { setShowDisclaimer(false); }}>
                                <Text style={{ color: '#555', marginRight: 15 }}>Cerrar</Text>
                            </Pressable>
                            <Pressable onPress={async () => {
                                try {
                                    if (user?._id) {
                                        await updateUserConsent({ uid: user._id, aiDisclaimerAcknowledgedAt: Date.now() });
                                        setUser({ ...user, aiDisclaimerAcknowledgedAt: Date.now() });
                                    }
                                } catch {}
                                setShowDisclaimer(false);
                            }}>
                                <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>Entendido</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

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