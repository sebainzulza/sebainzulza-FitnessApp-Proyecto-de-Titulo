import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from './../shared/Colors'
import Input from './../components/shared/Input'
import Button from './../components/shared/Button'
import { useConvex, useMutation } from 'convex/react'
import { api } from './../convex/_generated/api'
import { UserContext } from './../context/UserContext'
import { useRouter } from 'expo-router'
import { auth } from '../services/FirebaseConfig'
import Prompt from '../shared/Prompt'
import { CrearPlanIA } from '../services/AiModel'

export default function MisDatos() {
	const { user, setUser } = useContext(UserContext)
	const [peso, setPeso] = useState('')
	const [altura, setAltura] = useState('')
	const [genero, setGenero] = useState('')
	const [objetivo, setObjetivo] = useState('')
	const [diasEntrenamientoPorSemana, setDiasEntrenamientoPorSemana] = useState('')
	const [edad, setEdad] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const convex = useConvex()
	const UpdateUserPref = useMutation(api.Users.UpdateUserPref)

	useEffect(() => {
		if (!user) return;
		setPeso(user?.peso ? String(user.peso) : '')
		setAltura(user?.altura ? String(user.altura) : '')
		setGenero(user?.genero ? String(user.genero) : '')
		setObjetivo(user?.objetivo ? String(user.objetivo) : '')
		setDiasEntrenamientoPorSemana(user?.diasEntrenamientoPorSemana ? String(user.diasEntrenamientoPorSemana) : '')
		setEdad(user?.edad != null ? String(user.edad) : '')
	}, [user])

	const onGuardar = async () => {
		if (!peso || !altura || !genero || !objetivo || !diasEntrenamientoPorSemana || !edad) {
			Alert.alert('Alto!', 'Por favor completa todos los campos')
			return
		}
		setLoading(true)
		try {
			// Construir prompt para recalcular calorías y macros
			const PROMPT = JSON.stringify({
				peso,
				altura,
				genero,
				objetivo,
				diasEntrenamientoPorSemana,
				edad
			}) + Prompt.PROMPT_PLAN
			const resultadoIA = await CrearPlanIA(PROMPT)
			let macros = resultadoIA
			if (resultadoIA?.choices && resultadoIA.choices[0]?.message?.content) {
				macros = JSON.parse(resultadoIA.choices[0].message.content)
			}

			// Asegurar uid
			let uid = user?._id
			if (!uid) {
				const email = auth.currentUser?.email
				if (!email) {
					Alert.alert('Error', 'No se detectó sesión de usuario. Inicia sesión nuevamente.')
					setLoading(false)
					return
				}
				const userData = await convex.query(api.Users.GetUser, { email })
				if (!userData?._id) {
					Alert.alert('Error', 'No se pudo obtener tu usuario.')
					setLoading(false)
					return
				}
				uid = userData._id
			}

			await UpdateUserPref({
				uid,
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
			})

			// Actualizar contexto local para que UI y barra se refresquen
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
			}))

			Alert.alert('Listo', 'Datos actualizados correctamente')
			router.replace('/(tabs)/Home')
		} catch (e) {
			console.error('Error actualizando datos:', e)
			Alert.alert('Error', 'No se pudieron actualizar tus datos. Intenta nuevamente.')
		} finally {
			setLoading(false)
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
				fontSize: 26,
				fontWeight: 'bold',
				marginTop: 10
			}}>Editar mis datos</Text>

			<View style={{
				display: 'flex',
				flexDirection: 'row',
				gap: 10,
				marginTop: 20
			}}>
				<View style={{ flex: 1 }}>
					<Input placeholder={'Ej. 70'} label='Peso (kg)'
						value={peso}
						onChangeText={setPeso}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Input placeholder={'Ej. 1.70'} label='Altura (cm)'
						value={altura}
						onChangeText={setAltura}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Input placeholder={'Ej. 20'} label='Edad (años)'
						value={edad}
						onChangeText={setEdad}
					/>
				</View>
			</View>

			<View style={{ marginTop: 20 }}>
				<Text style={{ fontWeight: 'medium', fontSize: 18 }}>Género</Text>
				<View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 8 }}>
					<TouchableOpacity
						onPress={() => setGenero('Masculino')}
						style={[styles.pill, { borderColor: genero == 'Masculino' ? Colors.PRIMARY : Colors.GRAY }]}
					>
						<Text>Masculino</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setGenero('Femenino')}
						style={[styles.pill, { borderColor: genero == 'Femenino' ? Colors.PRIMARY : Colors.GRAY }]}
					>
						<Text>Femenino</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setGenero('Otro')}
						style={[styles.pill, { borderColor: genero == 'Otro' ? Colors.PRIMARY : Colors.GRAY }]}
					>
						<Text>Otro</Text>
					</TouchableOpacity>
				</View>
			</View>

			<Input placeholder={'Ej. 3'} label='Días de entrenamiento por semana'
				value={diasEntrenamientoPorSemana}
				onChangeText={setDiasEntrenamientoPorSemana}
			/>

			<View style={{ marginTop: 15 }}>
				<Text style={{ fontWeight: 'medium', fontSize: 18 }}>Objetivo</Text>
				<View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 8 }}>
					<TouchableOpacity
						onPress={() => setObjetivo('Perder peso')}
						style={[styles.pill, { borderColor: objetivo == 'Perder peso' ? Colors.PRIMARY : Colors.GRAY }]}
					>
						<Text>Perder peso</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setObjetivo('Aumento muscular')}
						style={[styles.pill, { borderColor: objetivo == 'Aumento muscular' ? Colors.PRIMARY : Colors.GRAY }]}
					>
						<Text>Aumento muscular</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setObjetivo('Aumento peso')}
						style={[styles.pill, { borderColor: objetivo == 'Aumento peso' ? Colors.PRIMARY : Colors.GRAY }]}
					>
						<Text>Aumento peso</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={{ marginTop: 25 }}>
				<Button title={loading ? 'Guardando...' : 'Guardar cambios'} onPress={onGuardar} disabled={loading} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	pill: {
		borderWidth: 1,
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: 10,
		flex: 1,
		alignItems: 'center'
	}
})


