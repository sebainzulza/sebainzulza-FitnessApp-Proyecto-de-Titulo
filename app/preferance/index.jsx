import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useContext } from 'react'
import Colors from './../../shared/Colors';
import Input from './../../components/shared/Input';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { MaleSymbolIcon, FemaleSymbolIcon, CircleIcon, WeightScale01Icon, Dumbbell01Icon, PlusSignSquareIcon } from '@hugeicons/core-free-icons';
import Button from './../../components/shared/Button';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from './../../convex/_generated/api';
import { UserContext } from './../../context/UserContext';
import { useRouter } from 'expo-router';
import Prompt from '../../shared/Prompt';
import { CrearPlanIA } from '../../services/AiModel';


export default function Preferance() {
    const [peso, setPeso] = useState();
    const [altura, setAltura] = useState();
    const [genero, setGenero] = useState();
    const [objetivo, setObejtivo] = useState();
    const [diasEntrenamientoPorSemana, setDiasEntrenamientoPorSemana] = useState();
    const [edad, setEdad] = useState();
    const { user, setUser } = useContext(UserContext)
    const router = useRouter();
    const UpdateUserPref = useMutation(api.Users.UpdateUserPref)

    const onContinue = async () => {
        if (!peso || !altura || !genero || !objetivo || !diasEntrenamientoPorSemana|| !edad) {
            Alert.alert('Alto!', 'Por favor completa todos los campos');
            return;
        }

        if (!peso || !altura || !genero || !objetivo || !diasEntrenamientoPorSemana || !edad) {
            Alert.alert('Alto!', 'Por favor completa todos los campos');
            return;
        }

        // Calcular calorías y macros con IA
        const PROMPT = JSON.stringify({
            peso,
            altura,
            genero,
            objetivo,
            diasEntrenamientoPorSemana,
            edad
        }) + Prompt.PROMPT_PLAN;
        console.log('PROMPT IA:', PROMPT);
        const resultadoIA = await CrearPlanIA(PROMPT);
        let macros = resultadoIA;
        if (resultadoIA.choices && resultadoIA.choices[0]?.message?.content) {
            macros = JSON.parse(resultadoIA.choices[0].message.content);
        }
        console.log('Macros IA:', macros);

        // Log del user._id para depuración
        console.log('user._id:', user?._id);

        try {
            const result = await UpdateUserPref({
                uid: user._id,
                altura: String(altura),
                peso: String(peso),
                genero: String(genero),
                objetivo: String(objetivo),
                diasEntrenamientoPorSemana: String(diasEntrenamientoPorSemana),
                edad: Number(edad),
                calorias: Number(macros.calorias),
                proteinas: Number(macros.proteinas),
                carbohidratos: Number(macros.carbohidratos),
                grasas: Number(macros.grasas)
            });
            // El resultado de la mutación no es necesario, solo se usa para confirmar que se ejecutó correctamente
            setUser(prev => ({
                ...prev,
                altura: String(altura),
                peso: String(peso),
                genero: String(genero),
                objetivo: String(objetivo),
                diasEntrenamientoPorSemana: String(diasEntrenamientoPorSemana),
                edad: Number(edad),
                calorias: Number(macros.calorias),
                proteinas: Number(macros.proteinas),
                carbohidratos: Number(macros.carbohidratos),
                grasas: Number(macros.grasas)
            }));
            router.replace('/(tabs)/Home');
        } catch (err) {
            console.error('Convex error:', err);
        }

    }

    return (
        <View style={{
            padding: 20,
            backgroundColor: Colors.WHITE,
            height: '100%'
        }}>
            <Text style={{
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                marginTop: 20
            }}>Cuéntanos sobre ti</Text>
            <Text style={{
                fontSize: 15,
                textAlign: 'center',
                color: Colors.GRAY
            }}>Esto nos ayuda a generar el mejor plan personalizado para ti</Text>

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10
            }}>
                <View style={{
                    flex: 1
                }}>
                    <Input placeholder={'Ej. 70'} label='Peso (kg)'
                        onChangeText={setPeso}
                    />
                </View>
                <View style={{
                    flex: 1
                }}>
                    <Input placeholder={'Ej. 1.70'} label='Altura (cm)'
                        onChangeText={setAltura}
                    />
                </View>
                <View style={{
                    flex: 1
                }}>
                    <Input placeholder={'Ej. 20'} label='Edad (años)'
                        onChangeText={setEdad}
                    />
                </View>


            </View>
            <View style={{
                marginTop: 20
            }}>
                <Text style={{
                    fontWeight: 'medium',
                    fontSize: 18
                }}>Género</Text>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10
                }}>
                    <TouchableOpacity
                        onPress={() => setGenero('Masculino')}
                        style={{
                            borderWidth: 1,
                            padding: 15,
                            borderColor: genero == 'Masculino' ? Colors.PRIMARY : Colors.GRAY,
                            borderRadius: 10,
                            flex: 1,
                            alignItems: 'center',

                        }}>
                        <HugeiconsIcon icon={MaleSymbolIcon} size={40} color={Colors.BLUE} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setGenero('Femenino')}
                        style={{
                            borderWidth: 1,
                            padding: 15,
                            borderColor: genero == 'Femenino' ? Colors.PRIMARY : Colors.GRAY,
                            borderRadius: 10,
                            flex: 1,
                            alignItems: 'center'
                        }}>
                        <HugeiconsIcon icon={FemaleSymbolIcon} size={40} color={Colors.PINK} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setGenero('Otro')}
                        style={{
                            borderWidth: 1,
                            padding: 15,
                            borderColor: genero == 'Otro' ? Colors.PRIMARY : Colors.GRAY,
                            borderRadius: 10,
                            flex: 1,
                            alignItems: 'center'
                        }}>
                        <HugeiconsIcon icon={CircleIcon} size={40} color={Colors.RED} />
                    </TouchableOpacity>
                </View>
            </View>

            <Input placeholder={'Ej. 3'} label='Cuántos días entrenas a la semana?'
                onChangeText={setDiasEntrenamientoPorSemana}
            />

            <View style={{
                marginTop: 15
            }}>
                <Text style={{
                    fontWeight: 'medium',
                    fontSize: 18
                }}>Cuál es tu objetivo?</Text>

                <TouchableOpacity
                    onPress={() => setObejtivo('Perder peso')}
                    style={[styles.goalContainer, {
                        borderColor: objetivo == 'Perder peso' ? Colors.PRIMARY : Colors.GRAY
                    }]}>
                    <HugeiconsIcon icon={WeightScale01Icon} />
                    <View>
                        <Text style={styles.goalText}>Perder peso</Text>
                        <Text>Perder grasa y ganar músculo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setObejtivo('Aumento muscular')}
                    style={[styles.goalContainer, {
                        borderColor: objetivo == 'Aumento muscular' ? Colors.PRIMARY : Colors.GRAY
                    }]}>
                    <HugeiconsIcon icon={Dumbbell01Icon} />
                    <View>
                        <Text style={styles.goalText}>Aumento muscular</Text>
                        <Text>Ganar masa y músculo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setObejtivo('Aumento peso')}
                    style={[styles.goalContainer, {
                        borderColor: objetivo == 'Aumento peso' ? Colors.PRIMARY : Colors.GRAY
                    }]}>
                    <HugeiconsIcon icon={PlusSignSquareIcon} />
                    <View>
                        <Text style={styles.goalText}>Aumento peso</Text>
                        <Text>Aumentar masa corporal sanamente</Text>
                    </View>
                </TouchableOpacity>

            </View>
            <View style={{
                marginTop: 25
            }}>
                <Button title={'Continuar'} onPress={onContinue} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    goalContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 15,
        marginTop: 10,
    },

    goalText: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    goalSubText: {
        color: Colors.GRAY
    }
})