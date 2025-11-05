// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Platform } from "react-native";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "fitnessapp-5b1d3.firebaseapp.com",
  projectId: "fitnessapp-5b1d3",
  storageBucket: "fitnessapp-5b1d3.firebasestorage.app",
  messagingSenderId: "779171736873",
  appId: "1:779171736873:web:f37c1646d07c4c11b4db38",
  measurementId: "G-4MDH8VV59F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = Platform.OS=='web' ?getAuth(app):initializeAuth(app,{
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
})