# Sistema de Rutinas de Ejercicios - Documentación

## 📋 Resumen de la Implementación

Se ha implementado un sistema completo de gestión de rutinas de ejercicios con las siguientes funcionalidades:

## 🗂️ Estructura de Archivos Creados/Modificados

### Archivos de Base de Datos (Convex)
- `convex/schema.js` - Agregadas tablas `rutinas` y `historialRutinas`
- `convex/Rutinas.js` - Todas las mutations y queries para rutinas

### Pantallas (app/rutinas/)
1. `index.jsx` - Lista de rutinas guardadas
2. `crear-rutina.jsx` - Paso 1: Nombre y objetivo
3. `seleccionar-ejercicios.jsx` - Paso 2: Elegir ejercicios
4. `configurar-series.jsx` - Paso 3: Configurar series/pesos/descansos
5. `ejecutar-rutina.jsx` - Pantalla de entrenamiento en vivo
6. `historial-rutina.jsx` - Ver historial de una rutina específica
7. `estadisticas.jsx` - Dashboard general de progreso

### Modificaciones
- `app/(tabs)/Ejercicios.jsx` - Agregado botón "Mis Rutinas de Ejercicio"

## 🎯 Flujo de Usuario

### 1. Crear Nueva Rutina
```
Ejercicios → Mis Rutinas → Botón "+" → Crear Rutina
```

**Paso 1: Información Básica**
- Nombre de la rutina (máx 50 caracteres)
- Objetivo: Fuerza, Hipertrofia, Resistencia, etc.
- Notas opcionales (máx 200 caracteres)

**Paso 2: Seleccionar Ejercicios**
- Filtrar por parte del cuerpo
- Ver GIF y nombre de cada ejercicio
- Seleccionar múltiples ejercicios (checkbox)
- Contador visual de ejercicios seleccionados

**Paso 3: Configurar Series y Pesos**
- Para cada ejercicio:
  - Series (1-10)
  - Repeticiones (1-50)
  - Peso en kg (0-500)
  - Descanso en segundos
- Botones +/- para ajustar valores
- Opción de eliminar ejercicios
- Guardar rutina

### 2. Ver Mis Rutinas
```
Ejercicios → Mis Rutinas
```

**Características:**
- Lista de todas las rutinas guardadas
- Información visible:
  - Nombre de la rutina
  - Objetivo
  - Cantidad de ejercicios
  - Duración aproximada
  - Fecha de creación
  - Indicador de favorita (estrella)

**Acciones disponibles:**
- ⭐ Marcar/desmarcar como favorita
- ▶️ Iniciar rutina
- ✏️ Editar rutina
- 📊 Ver historial
- 📋 Duplicar rutina
- 🗑️ Eliminar rutina

### 3. Ejecutar Rutina (Durante el Entrenamiento)
```
Mis Rutinas → Iniciar
```

**Interfaz:**
- **Header:**
  - Nombre de la rutina
  - Progreso: "Ejercicio X de Y"
  - Barra de progreso visual
  - Contador de series completadas

- **Pantalla Principal:**
  - GIF animado del ejercicio actual (tamaño grande)
  - Nombre del ejercicio
  - Información: Series × Reps y Peso

- **Timer de Descanso:**
  - Se activa automáticamente al completar una serie
  - Cuenta regresiva visible
  - Opción de saltar descanso
  - Color distintivo (naranja)

- **Lista de Series:**
  - Checkbox para cada serie
  - Muestra reps × peso
  - Visual diferente para series completadas
  - Tap para marcar/desmarcar

- **Navegación:**
  - Botón "Anterior" (deshabilitado en primer ejercicio)
  - Botón "Siguiente" (deshabilitado en último ejercicio)
  - Botón "Finalizar" en header

- **Al Finalizar:**
  - Resumen de la sesión:
    - Series completadas / totales
    - Volumen total levantado (kg)
    - Duración (minutos)
  - Se guarda automáticamente en historial

### 4. Ver Historial
```
Mis Rutinas → Rutina específica → Historial
```

**Muestra:**
- Fecha de cada sesión
- Duración
- Series completadas vs totales
- Volumen total
- Badge de "Completada" si se finalizó 100%
- Tiempo relativo ("Hace X días")

### 5. Estadísticas Generales
```
Mis Rutinas → Botón "Estadísticas"
```

**Dashboard que muestra:**
- **Estadística Principal:**
  - Total de sesiones de entrenamiento (grande, destacado)

- **Grid de Métricas:**
  - 🔥 Racha actual (días consecutivos)
  - ✓ Sesiones completadas
  - ⏱️ Tiempo total (horas)
  - 💪 Volumen total (toneladas)

- **Promedios:**
  - Duración por sesión
  - Volumen por sesión
  - Tasa de finalización (%)

- **Mensaje Motivacional:**
  - Basado en racha actual
  - Personalizado según progreso

## 🗄️ Estructura de Datos

### Tabla: rutinas
```javascript
{
  uid: Id<"Users">,
  nombreRutina: string,
  objetivo: string,
  notas?: string,
  ejercicios: [
    {
      ejercicioId: string,
      nombre: string,
      parteCuerpo: string,
      equipamiento: string,
      gifUrl: string,
      series: number,
      repeticiones: number,
      peso: number,
      descanso: number,
      orden: number
    }
  ],
  favorita?: boolean,
  fechaCreacion: number
}
```

### Tabla: historialRutinas
```javascript
{
  uid: Id<"Users">,
  rutinaId: Id<"rutinas">,
  fecha: string,
  duracion: number,
  ejerciciosRealizados: [
    {
      ejercicioId: string,
      seriesCompletadas: [
        {
          serie: number,
          repeticiones: number,
          peso: number,
          completada: boolean
        }
      ]
    }
  ],
  volumenTotal: number,
  completada: boolean
}
```

## 🔧 Funciones Convex Disponibles

### Mutations
- `CrearRutina` - Crear nueva rutina
- `ActualizarRutina` - Editar rutina existente
- `EliminarRutina` - Borrar rutina
- `MarcarFavorita` - Toggle favorita
- `DuplicarRutina` - Crear copia de rutina
- `GuardarHistorialRutina` - Registrar sesión completada

### Queries
- `ObtenerRutinasPorUsuario` - Listar todas las rutinas del usuario
- `ObtenerRutinaPorId` - Obtener detalles de una rutina
- `ObtenerHistorialRutinas` - Ver historial (todas o de una rutina específica)

## ✨ Características Destacadas

### 1. Timer de Descanso Automático
- Se inicia automáticamente al marcar una serie como completada
- Cuenta regresiva visual
- Se puede saltar si se desea
- Se detiene al cambiar de ejercicio

### 2. Progreso Visual
- Barra de progreso que muestra % de series completadas
- Contador numérico: "X/Y series"
- Indicador de "Ejercicio X de Y"

### 3. Favoritos
- Sistema de estrella para marcar rutinas favoritas
- Visual diferenciado (estrella dorada)
- Toggle rápido desde lista de rutinas

### 4. Duplicación de Rutinas
- Copia completa de ejercicios y configuración
- Solicita nuevo nombre
- Útil para crear variaciones (Ej: "Pierna A" → "Pierna B")

### 5. Validaciones
- No permite crear rutina sin nombre
- No permite crear rutina sin objetivo
- No permite continuar sin seleccionar ejercicios
- Advierte si intenta finalizar sin series completadas

### 6. Experiencia de Usuario
- Confirmaciones para acciones destructivas (eliminar)
- Mensajes de éxito al guardar
- Loading states durante guardado
- Navegación intuitiva con breadcrumbs ("Paso X de Y")

## 🎨 Diseño y UX

### Colores y Temas
- **Primary**: Acciones principales
- **Secondary**: Acciones secundarias
- **White**: Backgrounds de cards
- **Gray**: Texto secundario e información
- **Success (#4CAF50)**: Elementos completados
- **Warning (#FF9800)**: Timer de descanso
- **Error (#F44336)**: Acciones de eliminación

### Iconografía
- Uso consistente de HugeIcons
- Iconos intuitivos para cada acción
- Feedback visual en interacciones

## 📊 Métricas y Cálculos

### Volumen Total
```
volumen = Σ (peso × repeticiones × series_completadas)
```

### Duración Aproximada
```
duracion ≈ Σ (series × 30seg + series × descanso) / 60
```

### Racha
- Cuenta días consecutivos con al menos una sesión
- Se reinicia si pasa más de 1 día sin entrenar

### Tasa de Finalización
```
tasa = (sesiones_completadas / total_sesiones) × 100
```

## 🚀 Mejoras Futuras Sugeridas

1. **Plantillas Predefinidas**
   - Rutinas de ejemplo para principiantes
   - Templates por objetivo (Fuerza, Hipertrofia, etc.)

2. **Gráficos**
   - Línea de progreso de volumen en el tiempo
   - Gráfico de partes del cuerpo más entrenadas
   - Evolución de peso por ejercicio

3. **Social**
   - Compartir rutinas con código
   - Importar rutinas de otros usuarios

4. **Notificaciones**
   - Recordatorio para entrenar
   - Celebración de rachas

5. **Super-sets**
   - Agrupar ejercicios para hacer sin descanso

6. **Notas por Sesión**
   - Permitir agregar notas después de cada entrenamiento
   - Registro de sensaciones, PRs, etc.

## 🐛 Testing

### Flujo Completo a Probar:
1. ✅ Crear rutina con nombre y objetivo
2. ✅ Seleccionar 3-4 ejercicios de diferentes partes
3. ✅ Configurar series/pesos
4. ✅ Guardar rutina
5. ✅ Iniciar rutina desde lista
6. ✅ Completar algunas series
7. ✅ Verificar timer de descanso
8. ✅ Navegar entre ejercicios
9. ✅ Finalizar rutina
10. ✅ Ver historial
11. ✅ Ver estadísticas
12. ✅ Duplicar rutina
13. ✅ Eliminar rutina

---

**Implementado por:** GitHub Copilot  
**Fecha:** Noviembre 6, 2025  
**Versión:** 1.0.0
