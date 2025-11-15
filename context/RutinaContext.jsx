import React, { createContext, useState, useContext, useCallback } from 'react';

const RutinaContext = createContext();

export const RutinaProvider = ({ children }) => {
    const [rutinaEnCreacion, setRutinaEnCreacion] = useState({
        nombreRutina: '',
        objetivo: '',
        notas: '',
        ejercicios: []
    });

    const actualizarRutina = useCallback((datos) => {
        console.log('🔄 CONTEXTO: Actualizando rutina con:', datos)
        setRutinaEnCreacion(prev => {
            const nuevoEstado = {
                ...prev,
                ...datos
            }
            console.log('📝 CONTEXTO: Estado anterior:', prev)
            console.log('✅ CONTEXTO: Nuevo estado:', nuevoEstado)
            return nuevoEstado
        });
    }, []);

    const limpiarRutina = useCallback(() => {
        console.log('🧹 CONTEXTO: Limpiando rutina')
        setRutinaEnCreacion({
            nombreRutina: '',
            objetivo: '',
            notas: '',
            ejercicios: []
        });
    }, []);

    return (
        <RutinaContext.Provider value={{
            rutinaEnCreacion,
            actualizarRutina,
            limpiarRutina
        }}>
            {children}
        </RutinaContext.Provider>
    );
};

export const useRutina = () => {
    const context = useContext(RutinaContext);
    if (!context) {
        throw new Error('useRutina debe usarse dentro de RutinaProvider');
    }
    return context;
};
