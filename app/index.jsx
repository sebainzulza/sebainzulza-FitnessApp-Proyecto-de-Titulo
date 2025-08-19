
// Importaciones
import { Text, View, Image, Dimensions } from "react-native";
import Colors from "../shared/Colors";
import Button from "../components/shared/Button";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './../services/FirebaseConfig';
import { useContext, useEffect } from "react";
import { UserContext } from '@/context/UserContext'
import { useConvex } from "convex/react";
import { api } from "./../convex/_generated/api";


// Componente principal de la pantalla de inicio
export default function Index() {
  const router= useRouter();
  const { user, setUser } = useContext(UserContext);
  const convex = useConvex();

  useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth, async(userInfo)=> {
      console.log(userInfo?.email)
      const userData=await convex.query(api.Users.GetUser, { 
        email: userInfo?.email
      })
      console.log(userData);
      setUser(userData)
      router.replace('/(tabs)/Home')
    })
    return () => unsubscribe();
  },[])


  return (
    // Contenedor principal de la pantalla
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Imagen de fondo de la pantalla */}
      <Image
        source={require('./../assets/images/landing.jpg')}
        style={{
          width: "100%",
          height: Dimensions.get("screen").height,
        }}
      />

      {/* Capa oscura con contenido principal */}
      <View style={{
        position: 'absolute',
        height: Dimensions.get("screen").height,
        backgroundColor:'#0707075e',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 20
      }}>

        {/* Logo de la aplicación */}
        <Image source={require('./../assets/images/logo.png')}
          style={{
            width: 150,
            height: 150,
            marginTop: 100
          }}
        />

        {/* Título principal */}
        <Text style={{
          color: Colors.WHITE,
          fontSize: 30,
          fontWeight: 'bold',
        }}>
          FitnessApp
        </Text>

        {/* Descripción de la app */}
        <Text style={{
          color: Colors.WHITE,
          fontSize: 20,
          textAlign: 'center',
          marginHorizontal: 20,
          marginTop: 15,
          opacity: 0.8
        }}>
          El cambio comienza hoy con el seguimiento de tus ejercicios y comidas de la mano con las mejores recetas personalizadas
        </Text>

      </View>

      {/* Botón de acción principal en la parte inferior */}
      <View style={{
        position: 'absolute',
        width: '100%',
        bottom: 25,
        padding: 20
      }}>
        <Button
          title={"Comenzar!"}
          onPress={() => router.push('/auth/SignIn')}
        />
      </View>

    </View>
  );
}
