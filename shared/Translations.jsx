// Traducciones para ejercicios y partes del cuerpo
export const TRADUCCIONES_EJERCICIOS = {
  // Partes del cuerpo
  'back': 'Espalda',
  'cardio': 'Cardio',
  'chest': 'Pecho',
  'lower arms': 'Antebrazos',
  'lower legs': 'Piernas inferiores',
  'neck': 'Cuello',
  'shoulders': 'Hombros',
  'upper arms': 'Brazos superiores',
  'upper legs': 'Piernas superiores',
  'waist': 'Cintura',
  
  // Equipamiento
  'body weight': 'Peso corporal',
  'cable': 'Cable',
  'dumbbell': 'Mancuerna',
  'barbell': 'Barra',
  'kettlebell': 'Kettlebell',
  'resistance band': 'Banda de resistencia',
  'assisted': 'Asistido',
  
  // Músculos
  'upper back': 'Espalda superior',
  'lower back': 'Espalda inferior',
  'lats': 'Dorsales',
  'middle back': 'Espalda media',
  'traps': 'Trapecio',
  'biceps': 'Bíceps',
  'triceps': 'Tríceps',
  'forearms': 'Antebrazos',
  'calves': 'Pantorrillas',
  'glutes': 'Glúteos',
  'hamstrings': 'Isquiotibiales',
  'quads': 'Cuádriceps',
  'abs': 'Abdominales',
  'obliques': 'Oblicuos',
  'adductors': 'Aductores',
  'abductors': 'Abductores',
  'serratus anterior': 'Serrato anterior',
  'pectorals': 'Pectorales',
  'anterior deltoid': 'Deltoides anterior',
  'lateral deltoid': 'Deltoides lateral',
  'posterior deltoid': 'Deltoides posterior',
  'levator scapulae': 'Elevador de la escápula',
  'rhomboids': 'Romboides',
  'rear deltoid': 'Deltoides posterior'
}

export const traducirTexto = (texto) => {
  if (!texto || typeof texto !== 'string') {
    return 'Sin especificar'
  }
  return TRADUCCIONES_EJERCICIOS[texto.toLowerCase()] || texto
}
