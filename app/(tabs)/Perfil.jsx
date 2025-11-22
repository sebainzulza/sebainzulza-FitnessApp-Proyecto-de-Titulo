import { View, Text, Platform, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Colors from './../../shared/Colors';
import { auth } from './../../services/FirebaseConfig'
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const MenuOpciones = [
  {
    titulo: 'Editar Datos',
    emoji: '✏️',
    ruta: 'MisDatos'
  },
  {
    titulo: 'Términos y Condiciones',
    emoji: '⚖️',
    ruta: '/terminos-condiciones'
  },
  {
    titulo: 'Legal y Privacidad',
    emoji: '📋',
    ruta: '/legal-privacidad'
  },
  {
    titulo: 'Eliminar Cuenta',
    emoji: '🗑️',
    ruta: '/eliminar-cuenta',
    color: '#FF6B6B'
  },
  {
    titulo: 'Cerrar Sesión',
    emoji: '🚪',
    ruta: 'logout'
  }
]

export default function Perfil() {
  const { user, setUser } = useContext(UserContext)
  const router = useRouter();
  
  

  const OnMenuOptionClick=(menu)=>{
    if (menu.ruta=='logout')
      {
        signOut(auth).then(()=>{
          console.log('Sesión cerrada');
          setUser(null);
          router.replace('/');
        })
      return;
      }
      router.push(menu?.ruta)
  }

  
  return (
    <View style={{
      padding: 20,
      paddingTop: Platform.OS == 'ios' ? 40 : 25
    }}>
      <Text style={{
        fontSize: 25,
        fontWeight: 'bold'
      }}>Perfil</Text>

      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 15
      }}>
        <Image source={require('./../../assets/images/user.png')}
          style={{
            width: 100,
            height: 100,
            borderRadius: 99
          }}
        />
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 5
        }}>{user?.name}</Text>
        <Text style={{
          fontSize: 17,
          color: Colors.GRAY,
          marginTop: 5
        }}>{user?.email}</Text>
      </View>

      <FlatList
        data={MenuOpciones}
        style={{
          marginTop: 20
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
          onPress={()=>OnMenuOptionClick(item)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            padding: 15,
            borderWidth: 0.2,
            marginTop: 5,
            borderRadius: 15,
            backgroundColor: Colors.WHITE,
            elevation: 1
          }}>
            <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
            <Text style={{
              fontSize: 20,
              fontWeight: '300',
              color: item.color || 'black'
            }}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />

  {/* Eliminada: la funcionalidad de eliminar cuenta fue removida */}
    </View>
  )
}