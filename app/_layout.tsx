
// Importaciones
import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { UserContext } from "./../context/UserContext";
import { useState } from "react";

// Componente raíz que envuelve la app con el proveedor de datos y navegación
export default function RootLayout() {

  // Inicializa el cliente Convex con la URL pública
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });

  const [user, setUser] = useState();
  return (
    // Proveedor Convex para acceso global a la base de datos
    <ConvexProvider client={convex}>
      {/* Provee user y setUser a toda la app */}
      <UserContext.Provider value={{ user, setUser }}>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="index"/>
        </Stack>
      </UserContext.Provider>
    </ConvexProvider> 
  )
}
