# 📱 FitnessApp - Aplicación Completa de Fitness y Nutrición

## 📋 Descripción General del Proyecto

**FitnessApp** es una aplicación móvil multiplataforma (iOS y Android) construida con **React Native** y **Expo** que integra gestión de ejercicios, rutinas de entrenamiento personalizadas y generación inteligente de recetas nutritivas mediante Inteligencia Artificial.

La aplicación permite a los usuarios:
- 🏋️ Crear y seguir rutinas de ejercicio personalizadas
- 🍳 Generar recetas con IA basadas en ingredientes disponibles
- 📊 Hacer seguimiento de su progreso físico y nutricional
- 📅 Planificar comidas y entrenamientos diarios
- 👤 Gestionar su perfil y preferencias personales

---

## ✨ Características Principales

### 🏋️ Sistema Completo de Ejercicios y Rutinas

- **Catálogo de Ejercicios:** Base de datos completa con ejercicios organizados por grupos musculares
- **Creación de Rutinas:** Los usuarios pueden crear rutinas personalizadas seleccionando ejercicios
- **Configuración de Series:** Sistema para definir series, repeticiones y peso por ejercicio
- **Ejecución de Rutinas:** Interfaz interactiva para seguir las rutinas en tiempo real
- **Historial y Estadísticas:** Seguimiento completo del progreso con gráficas y métricas
- **Selector de Parte del Cuerpo:** Filtrado intuitivo de ejercicios por grupo muscular

### 🍳 Generador Inteligente de Recetas con IA

- **Generación Automática:** Crea recetas basadas en ingredientes que el usuario tiene disponibles
- **Validación Inteligente:** Sistema robusto que valida que solo se generen recetas de alimentos comestibles
- **Lista de Restricciones:** Palabras prohibidas para evitar generación de contenido no relacionado con comida (vehículos, materiales, electrónicos, etc.)
- **Soporte para Alergias:** Los usuarios pueden especificar alergias y restricciones alimenticias
- **Detalles Completos:** Cada receta incluye ingredientes, pasos detallados e información nutricional
- **Múltiples Opciones:** Genera varias opciones de recetas para que el usuario elija

### 📊 Seguimiento y Progreso

- **Progreso Diario:** Visualización del avance en ejercicios y alimentación
- **Gráficas Interactivas:** Uso de `react-native-chart-kit` para visualización de datos
- **Historial de Rutinas:** Registro completo de entrenamientos realizados
- **Plan Alimenticio:** Sistema para planificar comidas semanales

### 👤 Gestión de Usuario y Seguridad

- **Autenticación con Firebase:** Login y registro seguros con email/contraseña
- **Perfil Personalizable:** Los usuarios pueden actualizar sus datos personales
- **Sistema de Consentimiento:** Modal de disclaimer para funciones de IA
- **Privacidad y Legal:** Secciones de términos, condiciones y política de privacidad
- **Eliminación de Cuenta:** Opción para que los usuarios eliminen su cuenta

---

## 🛠️ Stack Tecnológico Completo

### **Framework Principal**

#### React Native + Expo
- **Versión:** React Native 0.79.5, Expo SDK ~53
- **Descripción:** Framework para desarrollo móvil multiplataforma que permite crear aplicaciones nativas para iOS y Android usando JavaScript/JSX
- **Ventajas:**
  - Código compartido entre plataformas (iOS, Android, Web)
  - Hot reload para desarrollo rápido
  - Acceso a APIs nativas
  - Gran ecosistema de librerías
- **Uso en el proyecto:** Base de toda la aplicación

### **Navegación y Enrutamiento**

#### Expo Router (~5.1.7)
- **Descripción:** Sistema de enrutamiento moderno basado en la estructura de archivos (file-based routing)
- **Características:**
  - Navegación declarativa: cada archivo en `/app` es una ruta
  - Soporte para tabs, stack y rutas anidadas
  - Deep linking automático
  - Tipado automático de rutas
- **Implementación:**
  - **Tabs:** [`(tabs)/_layout.jsx`](app/(tabs)/_layout.jsx) define la navegación principal con pestañas (Home, Ejercicios, Comidas, Progreso, Perfil)
  - **Auth:** [`auth/SignIn.jsx`](app/auth/SignIn.jsx) y [`auth/SignUp.jsx`](app/auth/SignUp.jsx) para autenticación
  - **Modales y Detalles:** Rutas dinámicas para detalles de ejercicios y recetas

#### @react-navigation/native (^7.1.6)
- Dependencia base para navegación
- Integración perfecta con Expo Router

### **Backend y Base de Datos**

#### Convex (^1.25.4)
- **Descripción:** Backend serverless con base de datos en tiempo real
- **Características clave:**
  - Base de datos reactiva con sincronización automática
  - Funciones serverless para lógica de backend
  - API type-safe generada automáticamente en TypeScript
  - Queries y Mutations en tiempo real
- **Implementación en el proyecto:**
  ```javascript
  // Uso de mutations
  const updateUserConsent = useMutation(api.Users.UpdateUserConsent);
  await updateUserConsent({ uid: user._id, aiDisclaimerAcknowledgedAt: Date.now() });
  
  // Uso de queries
  const userData = await convex.query(api.Users.GetUser, { email: email });
  ```
- **Archivos principales:**
  - [`convex/Users.js`](convex/Users.js) - Gestión de usuarios
  - [`convex/Recetas.js`](convex/Recetas.js) - Operaciones de recetas
  - [`convex/Rutinas.js`](convex/Rutinas.js) - Gestión de rutinas
  - [`convex/PlanAlimenticio.jsx`](convex/PlanAlimenticio.jsx) - Planes de comidas
  - [`convex/schema.js`](convex/schema.js) - Esquema de base de datos
  - [`convex/_generated/api.ts`](convex/_generated/api.ts) - API generada automáticamente

### **Autenticación**

#### Firebase Authentication (^12.1.0)
- **Descripción:** Sistema de autenticación completo de Google Firebase
- **Características implementadas:**
  - Registro con email y contraseña (`createUserWithEmailAndPassword`)
  - Login con email y contraseña (`signInWithEmailAndPassword`)
  - Persistencia de sesión con AsyncStorage en móvil
  - Gestión de tokens y sesiones
- **Configuración:**
  - Archivo: [`services/FirebaseConfig.jsx`](services/FirebaseConfig.jsx)
  - Configuración específica para web y móvil:
    ```javascript
    export const auth = Platform.OS == 'web' 
      ? getAuth(app) 
      : initializeAuth(app, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
    ```
- **Integración con Convex:** Después de autenticarse con Firebase, los datos del usuario se sincronizan con Convex para gestión de perfil y datos

### **Inteligencia Artificial**

#### OpenRouter API con Modelo Google Gemma
- **Modelo:** `google/gemma-3n-e2b-it:free`
- **Descripción:** API de OpenRouter que proporciona acceso a múltiples modelos de IA, usando Google Gemma para generación de contenido
- **Implementación:** [`services/AiModel.jsx`](services/AiModel.jsx)
- **Funcionalidades:**
  - **Generación de Recetas:** `GenerarIAReceta(PROMPT)`
  - **Creación de Planes:** `CrearPlanIA(PROMPT)`
  - Formato de respuesta JSON para fácil parseo
  - Sistema de prompts personalizados desde [`shared/Prompt.jsx`](shared/Prompt.jsx)
- **Flujo de generación:**
  ```javascript
  const PROMPT = input + Prompt.GENERAR_RECETA_OPCION_PROMPT;
  const recetas = await GenerarIAReceta(PROMPT);
  ```
- **Validaciones implementadas:**
  - Validación de longitud mínima de input
  - Filtrado de palabras no relacionadas con comida (más de 40 palabras prohibidas)
  - Manejo robusto de errores y respuestas

### **Gestión de Estado**

#### React Context API
- **Implementación:** Sistema de contextos para estado global
- **Contextos principales:**
  - **[`UserContext`](context/UserContext.jsx):** Maneja el estado del usuario autenticado, perfil y preferencias
  - **[`RutinaContext`](context/RutinaContext.jsx):** Gestiona el estado de rutinas en creación/ejecución
  - **[`RefreshDataContext`](context/RefreshDataContext.jsx):** Controla la recarga de datos en toda la app
- **Ventajas:**
  - Evita prop drilling
  - Estado compartido entre componentes
  - Fácil de testear y mantener

### **UI/UX y Componentes**

#### React Native Core Components
- **View, Text, TextInput, ScrollView, FlatList:** Componentes base
- **StyleSheet:** Sistema de estilos optimizado
- **Platform:** Detección de plataforma para estilos específicos
- **Modal, Alert, Pressable:** Componentes de interacción

#### @expo/vector-icons (^14.1.0)
- Librería de iconos con múltiples familias (Ionicons, MaterialIcons, FontAwesome, etc.)
- Uso extensivo en navegación y UI

#### @hugeicons/react-native (^1.0.7)
- Librería adicional de iconos modernos
- Icons personalizados para la app

#### react-native-chart-kit (^6.12.0)
- **Descripción:** Librería para gráficas y visualización de datos
- **Uso:** Progreso de ejercicios, estadísticas de rutinas, seguimiento nutricional
- **Tipos de gráficas:** LineChart, BarChart, ProgressChart

#### react-native-svg (^15.11.2)
- Soporte para gráficos vectoriales
- Requerido por chart-kit para renderizado de gráficas

#### expo-linear-gradient (~14.1.5)
- Gradientes lineales para diseño moderno
- Uso en headers, cards y fondos

#### expo-blur (~14.1.5)
- Efectos de blur/desenfoque para modales y overlays
- Mejora la estética de la UI

#### react-native-actions-sheet (^0.9.7)
- **Descripción:** Componente para bottom sheets (paneles deslizables desde abajo)
- **Uso:** [`AnadirAlPlanActionSheet.jsx`](components/AnadirAlPlanActionSheet.jsx) para añadir ejercicios al plan
- **Características:** Animaciones fluidas, gestos táctiles

### **Animaciones**

#### react-native-reanimated (~3.17.4)
- **Descripción:** Librería de animaciones de alto rendimiento
- **Características:**
  - Animaciones ejecutadas en el hilo nativo (60 FPS)
  - API declarativa y hooks
  - Soporte para gestos complejos
- **Uso potencial:** Transiciones entre pantallas, animaciones de cards, feedback táctil

#### expo-haptics (~14.1.4)
- Feedback háptico (vibraciones) para mejorar UX
- Uso en botones, confirmaciones y acciones importantes

### **Persistencia y Storage**

#### @react-native-async-storage/async-storage (^2.1.2)
- **Descripción:** Sistema de almacenamiento local persistente
- **Uso:**
  - Persistencia de sesión de Firebase Auth
  - Cache de datos offline
  - Preferencias de usuario

### **Utilidades**

#### moment (^2.30.1)
- Librería para manejo de fechas y horas
- Formateo de fechas en historial y progreso
- Cálculos de diferencias temporales

#### axios (^1.11.0)
- Cliente HTTP para peticiones a APIs
- Uso en servicios externos y fallback de fetch

#### expo-constants (~17.1.7)
- Acceso a constantes de la aplicación y entorno
- Variables de entorno y configuración

#### expo-linking (~7.1.7)
- Deep linking y manejo de URLs
- Navegación desde notificaciones o enlaces externos

### **Sistema de Colores y Estilos**

#### [`shared/Colors.jsx`](shared/Colors.jsx)
- **Descripción:** Paleta de colores centralizada para toda la aplicación
- **Ventajas:**
  - Consistencia visual
  - Fácil actualización de tema
  - Mantenibilidad

---

## 📁 Estructura Detallada del Proyecto

```
FitnessApp-Proyecto/
│
├── 📱 app/                                    # Pantallas y rutas de la aplicación
│   ├── (tabs)/                                # Navegación principal con pestañas
│   │   ├── _layout.jsx                        # Layout de tabs
│   │   ├── Home.jsx                           # Pantalla principal
│   │   ├── Ejercicios.jsx                     # Catálogo de ejercicios
│   │   ├── Comidas.jsx                        # Gestión de comidas
│   │   ├── Progreso.jsx                       # Seguimiento de progreso
│   │   └── Perfil.jsx                         # Perfil de usuario
│   │
│   ├── (profile)/                             # Sección de perfil anidada
│   │   └── LegalPrivacidad.jsx                # Privacidad dentro del perfil
│   │
│   ├── auth/                                  # Autenticación
│   │   ├── SignIn.jsx                         # Inicio de sesión
│   │   └── SignUp.jsx                         # Registro de usuario
│   │
│   ├── generar-receta-IA/                     # Generador de recetas con IA
│   │   └── index.jsx                          # Pantalla principal del generador
│   │                                          # Incluye validación y modal de disclaimer
│   │
│   ├── rutinas/                               # Sistema completo de rutinas
│   │   ├── index.jsx                          # Lista de rutinas
│   │   ├── crear-rutina.jsx                   # Creación de nueva rutina
│   │   ├── seleccionar-ejercicios.jsx         # Selector de ejercicios
│   │   ├── configurar-series.jsx              # Configuración de series/reps
│   │   ├── ejecutar-rutina.jsx                # Interfaz para seguir rutina
│   │   ├── historial-rutina.jsx               # Historial de entrenamientos
│   │   ├── estadisticas.jsx                   # Estadísticas y gráficas
│   │   └── progreso.jsx                       # Progreso de rutinas
│   │
│   ├── receta-detalle/                        # Detalle de recetas
│   │   └── index.jsx                          # Vista completa de receta
│   │
│   ├── preferance/                            # Preferencias de usuario
│   │   └── index.jsx                          # Configuración de preferencias
│   │
│   ├── _layout.jsx                            # Layout raíz de la aplicación
│   ├── index.jsx                              # Pantalla de bienvenida/inicial
│   ├── detalle-ejercicio.jsx                  # Detalle de un ejercicio específico
│   ├── MisDatos.jsx                           # Edición de datos personales
│   ├── eliminar-cuenta.jsx                    # Proceso de eliminación de cuenta
│   ├── legal-privacidad.jsx                   # Política de privacidad
│   └── terminos-condiciones.jsx               # Términos y condiciones
│
├── 🧩 components/                             # Componentes reutilizables
│   ├── shared/                                # Componentes base compartidos
│   │   ├── Button.jsx                         # Botón personalizado con loading
│   │   └── Input.jsx                          # Input de texto estilizado
│   │
│   ├── EjercicioCard.jsx                      # Tarjeta de ejercicio
│   ├── GenerarRecetaCard.jsx                  # Tarjeta de receta generada
│   ├── HomeHeader.jsx                         # Header de la pantalla Home
│   ├── IntroduccionReceta.jsx                 # Intro de receta con imagen/título
│   ├── ListaRecetaOpciones.jsx                # Lista de opciones de recetas
│   ├── LoadingTexto.jsx                       # Indicador de carga con texto
│   ├── ParteCuerpoSelector.jsx                # Selector de grupo muscular
│   ├── PlanAlimenticioCard.jsx                # Tarjeta de plan alimenticio
│   ├── PlanComidaDiario.jsx                   # Plan de comidas del día
│   ├── ProgresoDiario.jsx                     # Widget de progreso diario
│   ├── RecetaIngredientes.jsx                 # Lista de ingredientes de receta
│   ├── RecetaPasos.jsx                        # Pasos de preparación de receta
│   ├── RecetasCard.jsx                        # Tarjeta de receta guardada
│   ├── SeleccionFechaCard.jsx                 # Selector de fecha
│   └── AnadirAlPlanActionSheet.jsx            # Bottom sheet para añadir al plan
│
├── 🔄 context/                                # Contextos de React para estado global
│   ├── UserContext.jsx                        # Estado del usuario autenticado
│   ├── RutinaContext.jsx                      # Estado de rutinas
│   └── RefreshDataContext.jsx                 # Control de refresco de datos
│
├── ⚙️ services/                               # Servicios externos y APIs
│   ├── FirebaseConfig.jsx                     # Configuración de Firebase
│   ├── AiModel.jsx                            # Integración con OpenRouter/Gemma AI
│   └── EjerciciosAPI.jsx                      # API de ejercicios (probablemente externa)
│
├── 🎨 shared/                                 # Recursos compartidos
│   ├── Colors.jsx                             # Paleta de colores de la app
│   ├── Prompt.jsx                             # Prompts para IA
│   └── Translations.jsx                       # Traducciones/i18n
│
├── 🗄️ convex/                                 # Backend Convex
│   ├── _generated/                            # Código generado automáticamente
│   │   ├── api.d.ts                           # Definiciones TypeScript de API
│   │   ├── api.js                             # API JavaScript
│   │   ├── dataModel.d.ts                     # Modelo de datos TypeScript
│   │   ├── server.d.ts                        # Definiciones del servidor
│   │   └── server.js                          # Código del servidor
│   │
│   ├── schema.js                              # Esquema de base de datos
│   ├── Users.js                               # Funciones de usuarios (GetUser, UpdateUserConsent)
│   ├── Recetas.js                             # Funciones de recetas
│   ├── Rutinas.js                             # Funciones de rutinas
│   └── PlanAlimenticio.jsx                    # Funciones de planes alimenticios
│
├── 🖼️ assets/                                 # Recursos estáticos
│   └── images/                                # Imágenes y gráficos
│
├── ⚙️ Archivos de Configuración
│   ├── app.config.js                          # Configuración de Expo
│   ├── package.json                           # Dependencias y scripts
│   ├── tsconfig.json                          # Configuración de TypeScript
│   ├── .env.local                             # Variables de entorno (no en git)
│   ├── README.md                              # Este archivo
│   └── RUTINAS_README.md                      # Documentación específica de rutinas
```

---

## 🔧 Instalación y Configuración

### Prerrequisitos

- **Node.js:** v16 o superior
- **npm** o **yarn**
- **Expo CLI:** Instalado globalmente (`npm install -g expo-cli`)
- **Cuenta de Convex:** [convex.dev](https://convex.dev)
- **Cuenta de Firebase:** [firebase.google.com](https://firebase.google.com)
- **API Key de OpenRouter:** [openrouter.ai](https://openrouter.ai)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd FitnessApp-Proyecto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en Firebase Console
   - Habilitar Authentication con Email/Password
   - Copiar las credenciales de configuración
   - Actualizar [`services/FirebaseConfig.jsx`](services/FirebaseConfig.jsx) con tus credenciales

4. **Configurar Convex**
   ```bash
   npx convex dev
   ```
   - Seguir las instrucciones para crear/vincular un proyecto Convex
   - Se generará automáticamente la URL de Convex

5. **Configurar variables de entorno**
   
   Crear archivo `.env.local` en la raíz del proyecto:
   ```env
   EXPO_PUBLIC_CONVEX_URL=https://tu-proyecto.convex.cloud
   EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
   EXPO_PUBLIC_OPENROUTER_API_KEY=tu_openrouter_api_key
   ```

6. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o
   npx expo start
   ```

7. **Ejecutar en dispositivo o emulador**
   - **Android:** Presiona `a` o escanea el QR con Expo Go
   - **iOS:** Presiona `i` (requiere Mac con Xcode) o escanea el QR con Expo Go
   - **Web:** Presiona `w` para abrir en navegador

---

## 🚀 Scripts Disponibles

```json
{
  "start": "expo start",              // Iniciar servidor de desarrollo
  "android": "expo start --android",  // Abrir en Android
  "ios": "expo start --ios",          // Abrir en iOS
  "web": "expo start --web",          // Abrir en navegador
  "lint": "expo lint",                // Ejecutar linter
  "reset-project": "node ./scripts/reset-project.js"  // Reset del proyecto
}
```

---

## 🎯 Flujos Principales de la Aplicación

### 1. Flujo de Autenticación
```
Usuario sin sesión → SignIn/SignUp → Firebase Auth → 
Convex GetUser → UserContext → Navegación principal (Tabs)
```

### 2. Flujo de Generación de Recetas
```
Usuario ingresa ingredientes → Validación de input → 
Filtrado de palabras prohibidas → Llamada a OpenRouter AI → 
Parseo de JSON → Mostrar opciones → Usuario selecciona → 
Guardar en Convex (opcional) → Ver detalle completo
```

### 3. Flujo de Creación de Rutina
```
Crear nueva rutina → Seleccionar ejercicios (filtrar por parte del cuerpo) → 
Configurar series/reps/peso → Guardar en Convex → 
Ejecutar rutina → Marcar completada → 
Guardar en historial → Ver estadísticas
```

---

## 🔐 Seguridad y Privacidad

### Autenticación
- Passwords hasheados por Firebase
- Tokens JWT para sesiones
- Persistencia segura con AsyncStorage encriptado

### Variables de Entorno
- API Keys nunca en código fuente
- Uso de `process.env.EXPO_PUBLIC_*` para variables públicas
- `.env.local` en `.gitignore`

### Validaciones
- Validación de entradas de usuario en frontend y backend
- Sanitización de datos antes de enviar a IA
- Protección contra inyección de prompts maliciosos

### Consentimientos
- Modal de disclaimer para funciones de IA
- Guardado de consentimiento con timestamp
- Términos y condiciones aceptados explícitamente

### Eliminación de Datos
- Opción de eliminar cuenta desde la app
- Eliminación de todos los datos asociados al usuario

---

## 📱 Plataformas Soportadas

| Plataforma | Estado | Notas |
|------------|--------|-------|
| ✅ iOS | Soportado | iPhone y iPad |
| ✅ Android | Soportado | Teléfonos y tablets |

---

## 🎨 Diseño y Experiencia de Usuario

### Principios de Diseño
- **Simplicidad:** Interfaz limpia e intuitiva
- **Consistencia:** Uso de componentes compartidos y paleta de colores única
- **Feedback:** Indicadores de carga, animaciones y confirmaciones visuales
- **Accesibilidad:** Contraste adecuado, tamaños de texto legibles

### Sistema de Diseño
- **Colores:** Definidos en [`shared/Colors.jsx`](shared/Colors.jsx)
- **Componentes:** Librería de componentes reutilizables en `/components`
- **Tipografía:** System fonts para mejor rendimiento
- **Iconos:** @expo/vector-icons y @hugeicons

### Animaciones
- Transiciones suaves entre pantallas
- Feedback háptico en acciones importantes
- Loading states para operaciones asíncronas
- Animaciones nativas de 60 FPS con Reanimated

---

## 🧪 Testing y Calidad

### Linting
```bash
npm run lint
```

### Mejores Prácticas Implementadas
- Componentes funcionales con Hooks
- Separación de lógica y presentación
- Manejo robusto de errores
- Validación de datos de usuario
- Código modular y reutilizable

---

## 📊 Características Técnicas Destacadas

### 1. Validación Inteligente en Generador de Recetas

Implementación en [`generar-receta-IA/index.jsx`](app/generar-receta-IA/index.jsx):

```javascript
// Validación de longitud mínima
if (!input || input.trim().length < 2) {
    alert('Por favor ingresa ingredientes o una idea de receta.');
    return;
}

// Lista extensa de palabras prohibidas (40+ palabras)
const palabrasNoPermitidas = [
    'carro', 'auto', 'computadora', 'martillo', 'madera', 
    'cemento', 'ropa', 'mueble', 'papel', ...
];

// Detección de contenido no comestible
const contieneNoPermitido = palabrasNoPermitidas.some(palabra => 
    inputLower.includes(palabra)
);
```

### 2. Sistema de Disclaimer con Consentimiento

```javascript
// Modal automático en primera ejecución
useEffect(() => {
    if (user && !user?.aiDisclaimerAcknowledgedAt) {
        setShowDisclaimer(true);
    }
}, [user]);

// Guardado de consentimiento
await updateUserConsent({ 
    uid: user._id, 
    aiDisclaimerAcknowledgedAt: Date.now() 
});
```

### 3. Integración Convex para Datos en Tiempo Real

```javascript
// Query reactiva
const userData = await convex.query(api.Users.GetUser, { 
    email: email 
});

// Mutation
const updateUserConsent = useMutation(api.Users.UpdateUserConsent);
await updateUserConsent({ uid: user._id, data: {...} });
```

### 4. Persistencia de Auth Multiplataforma

```javascript
// Configuración adaptativa según plataforma
export const auth = Platform.OS == 'web' 
    ? getAuth(app) 
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
```

---

## 🌐 APIs Externas Utilizadas

### OpenRouter AI
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Modelo:** `google/gemma-3n-e2b-it:free`
- **Uso:** Generación de recetas y planes

### Firebase Services
- **Authentication:** Login/Registro
- **Analytics:** (si está configurado)

### API de Ejercicios (Externa)
- Implementada en [`services/EjerciciosAPI.jsx`](services/EjerciciosAPI.jsx)
- Probablemente consume una API REST de catálogo de ejercicios

---

## 📄 Documentación Adicional

- [`RUTINAS_README.md`](RUTINAS_README.md) - Documentación detallada del sistema de rutinas de ejercicios

---

## 🤝 Contribuciones

### Cómo Contribuir

1. Fork el repositorio
2. Crear una rama feature:
   ```bash
   git checkout -b feature/NuevaCaracteristica
   ```
3. Realizar cambios y commit:
   ```bash
   git commit -m 'feat: Agregar nueva característica'
   ```
4. Push a la rama:
   ```bash
   git push origin feature/NuevaCaracteristica
   ```
5. Crear un Pull Request

### Convenciones de Código
- Usar componentes funcionales con Hooks
- Nombres de archivos en PascalCase para componentes
- Usar PropTypes o TypeScript para tipado
- Comentarios claros en funciones complejas
- Mantener componentes pequeños y reutilizables

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Error de autenticación en Android
**Solución:** Verificar que `@react-native-async-storage/async-storage` esté instalado correctamente

### Problema: API Key de OpenRouter inválida
**Solución:** Verificar que la variable `EXPO_PUBLIC_OPENROUTER_API_KEY` esté correctamente configurada en `.env.local` y reiniciar el servidor

---

## 📈 Roadmap Futuro (Posibles Mejoras)

- [ ] Notificaciones push para recordatorios de rutinas
- [ ] Modo offline completo
- [ ] Integración con wearables (Apple Watch, Fitbit)
- [ ] Red social: compartir rutinas y recetas
- [ ] Gamificación: logros y badges
- [ ] Soporte multiidioma completo
- [ ] Modo oscuro
- [ ] Exportar/importar rutinas y planes
- [ ] Videos de ejercicios
- [ ] Chat con entrenador AI

---

## 📝 Licencia

[Especificar la licencia del proyecto - MIT, Apache, GPL, etc.]

---

## 👨‍💻 Autor y Equipo

[Agregar información del autor o equipo de desarrollo]

---

## 📞 Soporte y Contacto

[Agregar información de contacto o links a issues de GitHub]

---

## ⚠️ Disclaimer Legal

**Los planes de entrenamiento y recetas generados por IA son orientativos y educativos. No sustituyen el consejo de profesionales certificados en salud, nutrición o entrenamiento físico. Consulta con un médico antes de iniciar cualquier programa de ejercicios o cambios en tu dieta.**

---

## 🙏 Agradecimientos

- Expo Team por el increíble framework
- Convex por el backend serverless
- Firebase por los servicios de autenticación
- OpenRouter y Google por los modelos de IA
- Comunidad de React Native

---

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2025

