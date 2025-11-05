import { View, Text, Image, Alert, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native'
import React , { useState, useContext } from 'react'
import Input from "../../components/shared/Input"
import Button from "../../components/shared/Button"
import { Link } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/FirebaseConfig';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { UserContext } from '../../context/UserContext';

export default function SignUp() {
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showLegal, setShowLegal] = useState(false);
    const createNewUser=useMutation(api.Users.CreateNewUser);
    const updateUserConsent=useMutation(api.Users.UpdateUserConsent);
    const {user,setUser}=useContext(UserContext);

    const onSignUp = () => {
        if (!name || !email || !password) {
            Alert.alert('Alto!','Por favor completa todos los campos');
            return;
        }

        if (!acceptedTerms) {
            Alert.alert('Términos y Condiciones','Debes aceptar los Términos y Condiciones antes de crear una cuenta.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user)
                if (user) {
                    const result = await createNewUser({ name: name,
                    email: email
                });
                    console.log(result)
                    setUser(result);
                    // Guardar aceptación de términos
                    try {
                        if (result?._id && acceptedTerms) {
                            await updateUserConsent({ uid: result._id, acceptedTermsAt: Date.now() });
                        }
                    } catch (e) { console.log('Consent save error', e?.message || e); }
                }
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                // ..
            });
    }
  return (
    <View style={{
        display: 'flex',
        alignItems: 'center',
        padding: 20
    }}>
      <Image source={require('./../../assets/images/logo.png')}
        style={{
            width: 200,
            height: 200,
            marginTop: 60
        }}
      />


        <Text style={{
            fontSize: 35,
            fontWeight: 'bold',
            textAlign: 'center'
        }}>Crear una nueva cuenta</Text>

        <View style={{
            merginTop: 20,
            width: '100%'
        }}>
            <Input placeholder={'Nombre'} onChangeText={setName}/>
            <Input placeholder={'Email'} onChangeText={setEmail}/>
            <Input placeholder={'Contraseña'} password={true} onChangeText={setPassword}/>
        </View>

        <View style={{
            width: '100%',
            marginTop: 15
        }}>
            <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#999', marginRight: 8, backgroundColor: acceptedTerms ? '#4caf50' : 'transparent' }} />
                <Text style={{ flex: 1 }}>
                    He leído y acepto <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} onPress={() => setShowTerms(true)}>Términos y Condiciones</Text> y <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} onPress={() => setShowLegal(true)}>Legal y Privacidad</Text>
                </Text>
            </TouchableOpacity>
            <Button title={'Crear cuenta'} onPress={()=>onSignUp()} disabled={!acceptedTerms}/>

            <Text style={{
                textAlign: 'center',
                fontSyze: 16,
                marginTop: 15
            }}>Ya tienes una cuenta?</Text>

            <Link href={'/auth/SignIn'}><Text
            style={{
                textAlign: 'center',
                fontSyze: 16,
                marginTop: 5,
                fontWeight: 'bold'
            }}>Iniciar sesión</Text></Link>
        </View>

        {/* Modal: Términos y Condiciones */}
        <Modal visible={showTerms} transparent animationType='fade' onRequestClose={() => setShowTerms(false)}>
            <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center', padding: 20 }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 15, maxHeight: '85%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Términos y Condiciones</Text>
                        <Pressable onPress={() => setShowTerms(false)} style={{ padding: 8 }}>
                            <Text style={{ fontSize: 18 }}>✕</Text>
                        </Pressable>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{ fontSize: 14, lineHeight: 20 }}>
Descargo de Responsabilidad sobre los Planes Alimenticios Generados por IA{"\n\n"}
1. Naturaleza del Servicio y Propósito Informativo Los planes alimenticios ofrecidos en esta aplicación son generados automáticamente por un sistema de Inteligencia Artificial (IA). El propósito de estas recomendaciones es estrictamente informativo y educativo, diseñado para ofrecer una guía general y sugerencias basadas en los datos proporcionados por el usuario.{"\n\n"}
2. Generación Basada en Algoritmos y Datos del Usuario Queremos que seas plenamente consciente de que nuestros planes alimenticios no son creados por un nutricionista humano. Se basan en algoritmos que procesan la información que tú ingresas (como edad, peso, altura, género, nivel de actividad y objetivos). El sistema utiliza estos datos para realizar un cálculo algorítmico y estimar tus necesidades calóricas y de macronutrientes (proteínas, carbohidratos y grasas).{"\n\n"}
3. No Constituye Asesoramiento Médico ni Nutricional Profesional Este servicio no reemplaza, ni pretende reemplazar, la consulta con un nutricionista, dietista, médico u otro profesional de la salud calificado. La Inteligencia Artificial no es un profesional de la salud y no puede diagnosticar condiciones médicas, tener en cuenta tu historial clínico completo, alergias, intolerancias, patologías preexistentes o necesidades nutricionales específicas. Las recomendaciones generadas no constituyen un consejo médico ni un plan de tratamiento.{"\n\n"}
4. Los Cálculos son Estimaciones Aproximadas Es crucial entender que todos los cálculos de calorías, macronutrientes, micronutrientes y porciones son estimaciones. Estos valores deben ser considerados como un punto de partida y una guía general, no como una pauta estricta y científicamente precisa. El metabolismo y las necesidades de cada individuo son únicos y pueden variar significativamente respecto a los cálculos de cualquier algoritmo.{"\n\n"}
5. Responsabilidad del Usuario El uso de la información y los planes alimenticios proporcionados por esta aplicación es bajo tu propio riesgo. Te recomendamos encarecidamente que consultes con un profesional de la salud antes de iniciar cualquier plan alimenticio o realizar cambios significativos en tu dieta, especialmente si tienes condiciones médicas preexistentes (como diabetes, enfermedades renales, trastornos alimenticios), alergias, intolerancias alimentarias o si estás embarazada o en período de lactancia. Es tu responsabilidad evaluar la idoneidad de las sugerencias para tus propias necesidades.{"\n\n"}
6. Sin Garantía de Resultados No garantizamos resultados específicos (como pérdida de peso, ganancia muscular, etc.) derivados del seguimiento de los planes alimenticios generados. Los resultados individuales dependen de una multitud de factores que están fuera del control de esta aplicación, incluyendo la genética, el cumplimiento del plan, la precisión de los datos ingresados y otros hábitos de vida.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>

        {/* Modal: Legal y Privacidad */}
        <Modal visible={showLegal} transparent animationType='fade' onRequestClose={() => setShowLegal(false)}>
            <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center', padding: 20 }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 15, maxHeight: '85%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Legal y Privacidad</Text>
                        <Pressable onPress={() => setShowLegal(false)} style={{ padding: 8 }}>
                            <Text style={{ fontSize: 18 }}>✕</Text>
                        </Pressable>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{ fontSize: 14, lineHeight: 20, color: '#444' }}>
1. Introducción: Esta aplicación recopila y procesa datos personales conforme a la legislación vigente.{"\n\n"}
2. Uso de datos: Los datos se utilizan exclusivamente para mejorar la experiencia del usuario y no se comparten con terceros sin consentimiento.{"\n\n"}
3. Seguridad: Implementamos medidas de seguridad para proteger la información personal de accesos no autorizados.{"\n\n"}
4. Privacidad: El usuario puede solicitar la eliminación de sus datos en cualquier momento.{"\n\n"}
5. Cookies: La app puede utilizar cookies para optimizar el funcionamiento y personalización.{"\n\n"}
6. Modificaciones: Nos reservamos el derecho de modificar esta política en cualquier momento. Se notificará a los usuarios sobre cambios importantes.{"\n\n"}
7. Contacto: Para dudas o solicitudes sobre privacidad, contactar a soporte@fitnessapp.com.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    </View>
  )
}