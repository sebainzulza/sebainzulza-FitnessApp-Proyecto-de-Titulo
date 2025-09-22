import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { UserContext } from "./../context/UserContext";
import { RefreshDataContext } from "./../context/RefreshDataContext";
import { useState } from "react";

// Componente raíz que envuelve la app con el proveedor de datos y navegación
export default function RootLayout() {

  // Inicializa el cliente Convex con la URL pública
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
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
          <Stack screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="index" />
          </Stack>
        </RefreshDataContext.Provider>
      </UserContext.Provider>
    </ConvexProvider>
  )
}
