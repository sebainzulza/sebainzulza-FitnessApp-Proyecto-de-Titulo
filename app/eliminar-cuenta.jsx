import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform, TextInput, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import Colors from '../shared/Colors'
import { auth } from '../services/FirebaseConfig'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useRouter } from 'expo-router'

export default function EliminarCuenta() {
  const { user, setUser } = useContext(UserContext)
  const router = useRouter()
  const [showReauth, setShowReauth] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: eliminarCuenta
        }
      ]
    )
  }

  const eliminarCuenta = async () => {
    try {
      const usuario = auth.currentUser
      await deleteUser(usuario)
      setUser(null)
      router.replace('/')
    } catch (error) {
      console.error("Error al eliminar cuenta:", error)
      // Firebase requires a recent login to perform sensitive operations like deleting the user.
      if (error?.code === 'auth/requires-recent-login') {
        // Show UI to reauthenticate
        setShowReauth(true)
        return
      }

      Alert.alert(
        "Error",
        "Hubo un problema al eliminar la cuenta. Por favor, inténtalo de nuevo.",
        [{ text: "OK" }]
      )
    }
  }

  const handleReauthenticateAndDelete = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'No hay un usuario autenticado.')
      return
    }

    // Check provider: only support email/password reauth here
    const providers = auth.currentUser.providerData?.map(p => p.providerId) || []
    if (!providers.includes('password')) {
      Alert.alert('Reautenticación requerida', 'Tu cuenta fue autenticada con un proveedor externo. Vuelve a iniciar sesión con ese proveedor para eliminar la cuenta.')
      return
    }

    if (!password) {
      Alert.alert('Contraseña requerida', 'Por favor ingresa tu contraseña para reautenticar.')
      return
    }

    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
      await reauthenticateWithCredential(auth.currentUser, credential)
      // now try delete again
      await deleteUser(auth.currentUser)
      setUser(null)
      router.replace('/')
    } catch (err) {
      console.error('Reauth / delete error:', err)
      if (err?.code === 'auth/wrong-password') {
        Alert.alert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.')
      } else if (err?.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'Se requiere iniciar sesión nuevamente antes de eliminar la cuenta.')
      } else {
        Alert.alert('Error', 'No se pudo eliminar la cuenta. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
      setPassword('')
      setShowReauth(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eliminar Cuenta</Text>
      <Text style={styles.warning}>
        Advertencia: Esta acción eliminará permanentemente tu cuenta y todos tus datos asociados.
        Esta acción no se puede deshacer.
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={confirmarEliminacion}
      >
        <Text style={styles.deleteButtonText}>Eliminar mi cuenta</Text>
      </TouchableOpacity>

      {showReauth && (
        <View style={styles.reauthContainer}>
          <Text style={styles.reauthTitle}>Reautenticar</Text>
          <Text style={styles.reauthText}>Por seguridad, ingresa tu contraseña para confirmar la eliminación.</Text>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={handleReauthenticateAndDelete} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.WHITE} /> : <Text style={styles.deleteButtonText}>Reautenticar y eliminar</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  warning: {
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 30,
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reauthContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 0.5,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    backgroundColor: Colors.WHITE
  },
  reauthTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  reauthText: {
    color: Colors.GRAY,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  }
})