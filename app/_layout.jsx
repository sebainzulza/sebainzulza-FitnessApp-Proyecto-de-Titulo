import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { UserContext } from "../context/UserContext";
import { RefreshDataContext } from "../context/RefreshDataContext";
import { RutinaProvider } from "../context/RutinaContext";
import { useState } from "react";

// Componente raíz que envuelve la app con el proveedor de datos y navegación
export default function RootLayout() {

  // Inicializa el cliente Convex con la URL pública
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("EXPO_PUBLIC_CONVEX_URL environment variable is not set");
  }
  const convex = new ConvexReactClient(convexUrl, {
    unsavedChangesWarning: false,
  });

  const [user, setUser] = useState();
  const [refreshData, setRefreshData] = useState();

  return (
    // Proveedor Convex para acceso global a la base de datos
    <ConvexProvider client={convex}>
      {/* Provee user y setUser a toda la app */}
      <UserContext.Provider value={{ user, setUser }}>
        <RefreshDataContext.Provider value={{ refreshData, setRefreshData }}>
          <RutinaProvider>
            <Stack screenOptions={{
              headerShown: false
            }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="detalle-ejercicio" />
              <Stack.Screen name="terminos-condiciones" />
              <Stack.Screen name="legal-privacidad" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </RutinaProvider>
        </RefreshDataContext.Provider>
      </UserContext.Provider>
    </ConvexProvider>
  )
}
