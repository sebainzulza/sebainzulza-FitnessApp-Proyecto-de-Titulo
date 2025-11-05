import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Colors from '../shared/Colors'

const contenido = `Descargo de Responsabilidad sobre los Planes Alimenticios Generados por IA

1. Naturaleza del Servicio y Propósito Informativo Los planes alimenticios ofrecidos en esta aplicación son generados automáticamente por un sistema de Inteligencia Artificial (IA). El propósito de estas recomendaciones es estrictamente informativo y educativo, diseñado para ofrecer una guía general y sugerencias basadas en los datos proporcionados por el usuario.

2. Generación Basada en Algoritmos y Datos del Usuario Queremos que seas plenamente consciente de que nuestros planes alimenticios no son creados por un nutricionista humano. Se basan en algoritmos que procesan la información que tú ingresas (como edad, peso, altura, género, nivel de actividad y objetivos). El sistema utiliza estos datos para realizar un cálculo algorítmico y estimar tus necesidades calóricas y de macronutrientes (proteínas, carbohidratos y grasas).

3. No Constituye Asesoramiento Médico ni Nutricional Profesional Este servicio no reemplaza, ni pretende reemplazar, la consulta con un nutricionista, dietista, médico u otro profesional de la salud calificado. La Inteligencia Artificial no es un profesional de la salud y no puede diagnosticar condiciones médicas, tener en cuenta tu historial clínico completo, alergias, intolerancias, patologías preexistentes o necesidades nutricionales específicas. Las recomendaciones generadas no constituyen un consejo médico ni un plan de tratamiento.

4. Los Cálculos son Estimaciones Aproximadas Es crucial entender que todos los cálculos de calorías, macronutrientes, micronutrientes y porciones son estimaciones. Estos valores deben ser considerados como un punto de partida y una guía general, no como una pauta estricta y científicamente precisa. El metabolismo y las necesidades de cada individuo son únicos y pueden variar significativamente respecto a los cálculos de cualquier algoritmo.

5. Responsabilidad del Usuario El uso de la información y los planes alimenticios proporcionados por esta aplicación es bajo tu propio riesgo. Te recomendamos encarecidamente que consultes con un profesional de la salud antes de iniciar cualquier plan alimenticio o realizar cambios significativos en tu dieta, especialmente si tienes condiciones médicas preexistentes (como diabetes, enfermedades renales, trastornos alimenticios), alergias, intolerancias alimentarias o si estás embarazada o en período de lactancia. Es tu responsabilidad evaluar la idoneidad de las sugerencias para tus propias necesidades.

6. Sin Garantía de Resultados No garantizamos resultados específicos (como pérdida de peso, ganancia muscular, etc.) derivados del seguimiento de los planes alimenticios generados. Los resultados individuales dependen de una multitud de factores que están fuera del control de esta aplicación, incluyendo la genética, el cumplimiento del plan, la precisión de los datos ingresados y otros hábitos de vida.`

export default function TerminosCondiciones() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.WHITE, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
        Términos y Condiciones
      </Text>
      <Text style={{ fontSize: 16, color: Colors.GRAY, lineHeight: 22 }}>
        {contenido}
      </Text>
    </ScrollView>
  )
}


