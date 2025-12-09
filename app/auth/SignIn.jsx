import { View, Text, Image, Alert} from 'react-native'
import React , { useState, useContext } from 'react'
import Input from "../../components/shared/Input"
import Button from "../../components/shared/Button"
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/FirebaseConfig';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { UserContext } from '../../context/UserContext';

export default function SignIn() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const convex=useConvex();
    const {user,setUser}=useContext(UserContext);
    const onSignIn = () => {
        if (!email || !password) {
            Alert.alert('Alto!','Por favor completa todos los campos');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userData=await convex.query(api.Users.GetUser, { 
                email: email
            })

            console.log(userData);
            setUser(userData);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert("Credenciales incorrectas", "Por favor verifica tu email y contraseña");
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
            fontWeight: 'bold'
        }}>Bienvenido de vuelta</Text>

        <View style={{
            merginTop: 20,
            width: '100%'
        }}>
            <Input placeholder={'Email'} value={email} onChangeText={setEmail} inputType='email' keyboardType='email-address'/>
            <Input placeholder={'Contraseña'} value={password} password={true} onChangeText={setPassword} inputType='text'/>
        </View>

        <View style={{
            width: '100%',
            marginTop: 15
        }}>
            <Button title={'Iniciar Sesión'} onPress={()=>onSignIn()}/>

            <Text style={{
                textAlign: 'center',
                fontSyze: 16,
                marginTop: 15
            }}>No tienes una cuenta aún? No hay problema!</Text>

            <Link href={'/auth/SignUp'}><Text
            style={{
                textAlign: 'center',
                fontSyze: 16,
                marginTop: 5,
                fontWeight: 'bold'
            }}>Crear una cuenta</Text></Link>
        </View>

    </View>
  )
}