import { View, Text, Image, Alert} from 'react-native'
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
    const createNewUser=useMutation(api.Users.CreateNewUser);
    const {user,setUser}=useContext(UserContext);

    const onSignUp = () => {
        if (!name || !email || !password) {
            Alert.alert('Alto!','Por favor completa todos los campos');
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
            <Button title={'Crear cuenta'} onPress={()=>onSignUp()}/>

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

    </View>
  )
}