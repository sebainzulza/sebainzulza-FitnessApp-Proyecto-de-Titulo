 import React from 'react';

const API_KEY = '7916c9f2b4mshbc093af4a01ea44p12fbf8jsn6056faccdb2a';
const API_HOST = 'exercisedb.p.rapidapi.com';
const BASE_URL = 'https://exercisedb.p.rapidapi.com/exercises';

export const EjerciciosAPI = {
  // Obtener ejercicios por parte del cuerpo
  getEjerciciosPorParteDelCuerpo: async (bodyPart) => {
    try {
      const response = await fetch(`${BASE_URL}/bodyPart/${bodyPart}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      throw error;
    }
  },

  // Obtener todas las partes del cuerpo disponibles
  getPartesDelCuerpo: async () => {
    try {
      const response = await fetch(`${BASE_URL}/bodyPartList`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener partes del cuerpo:', error);
      throw error;
    }
  },

  // Obtener un ejercicio específico por ID
  getEjercicioPorId: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/exercise/${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener ejercicio:', error);
      throw error;
    }
  }
};

export default EjerciciosAPI;
