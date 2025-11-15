import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear nueva rutina
export const CrearRutina = mutation({
    args: {
        uid: v.id('Users'),
        nombreRutina: v.string(),
        objetivo: v.string(),
        notas: v.optional(v.string()),
        ejercicios: v.array(v.object({
            ejercicioId: v.string(),
            nombre: v.string(),
            parteCuerpo: v.string(),
            equipamiento: v.string(),
            gifUrl: v.string(),
            series: v.number(),
            repeticiones: v.number(),
            peso: v.number(),
            descanso: v.number(),
            orden: v.number()
        })),
        favorita: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('rutinas', {
            uid: args.uid,
            nombreRutina: args.nombreRutina,
            objetivo: args.objetivo,
            notas: args.notas,
            ejercicios: args.ejercicios,
            favorita: args.favorita || false,
            fechaCreacion: Date.now(),
        });
        return result;
    }
});

// Obtener todas las rutinas de un usuario
export const ObtenerRutinasPorUsuario = query({
    args: {
        uid: v.id('Users')
    },
    handler: async (ctx, args) => {
        const rutinas = await ctx.db.query('rutinas')
            .filter((q) => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect();
        return rutinas;
    }
});

// Obtener una rutina específica por ID
export const ObtenerRutinaPorId = query({
    args: {
        id: v.id('rutinas')
    },
    handler: async (ctx, args) => {
        const rutina = await ctx.db.get(args.id);
        return rutina;
    }
});

// Actualizar rutina
export const ActualizarRutina = mutation({
    args: {
        id: v.id('rutinas'),
        nombreRutina: v.optional(v.string()),
        objetivo: v.optional(v.string()),
        notas: v.optional(v.string()),
        ejercicios: v.optional(v.array(v.object({
            ejercicioId: v.string(),
            nombre: v.string(),
            parteCuerpo: v.string(),
            equipamiento: v.string(),
            gifUrl: v.string(),
            series: v.number(),
            repeticiones: v.number(),
            peso: v.number(),
            descanso: v.number(),
            orden: v.number()
        }))),
        favorita: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    }
});

// Eliminar rutina
export const EliminarRutina = mutation({
    args: {
        id: v.id('rutinas')
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    }
});

// Marcar rutina como favorita
export const MarcarFavorita = mutation({
    args: {
        id: v.id('rutinas'),
        favorita: v.boolean()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            favorita: args.favorita
        });
        return { success: true };
    }
});

// Duplicar rutina
export const DuplicarRutina = mutation({
    args: {
        id: v.id('rutinas'),
        nuevoNombre: v.string()
    },
    handler: async (ctx, args) => {
        const rutinaOriginal = await ctx.db.get(args.id);
        if (!rutinaOriginal) {
            throw new Error("Rutina no encontrada");
        }

        const result = await ctx.db.insert('rutinas', {
            uid: rutinaOriginal.uid,
            nombreRutina: args.nuevoNombre,
            objetivo: rutinaOriginal.objetivo,
            notas: rutinaOriginal.notas,
            ejercicios: rutinaOriginal.ejercicios,
            favorita: false,
            fechaCreacion: Date.now(),
        });
        return result;
    }
});

// Guardar historial de rutina completada
export const GuardarHistorialRutina = mutation({
    args: {
        uid: v.id('Users'),
        rutinaId: v.id('rutinas'),
        fecha: v.string(),
        duracion: v.number(),
        ejerciciosRealizados: v.array(v.object({
            ejercicioId: v.string(),
            seriesCompletadas: v.array(v.object({
                serie: v.number(),
                repeticiones: v.number(),
                peso: v.number(),
                completada: v.boolean()
            }))
        })),
        volumenTotal: v.number(),
        completada: v.boolean()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('historialRutinas', {
            uid: args.uid,
            rutinaId: args.rutinaId,
            fecha: args.fecha,
            duracion: args.duracion,
            ejerciciosRealizados: args.ejerciciosRealizados,
            volumenTotal: args.volumenTotal,
            completada: args.completada
        });
        return result;
    }
});

// Obtener historial de rutinas
export const ObtenerHistorialRutinas = query({
    args: {
        uid: v.id('Users'),
        rutinaId: v.optional(v.id('rutinas'))
    },
    handler: async (ctx, args) => {
        let queryBuilder = ctx.db.query('historialRutinas')
            .filter((q) => q.eq(q.field('uid'), args.uid));
        
        if (args.rutinaId) {
            queryBuilder = queryBuilder.filter((q) => 
                q.eq(q.field('rutinaId'), args.rutinaId)
            );
        }
        
        const historial = await queryBuilder
            .order('desc')
            .collect();
        
        return historial;
    }
});

// Obtener estadísticas por periodo
export const ObtenerEstadisticasPorPeriodo = query({
    args: {
        uid: v.id('Users'),
        fechaInicio: v.string(),
        fechaFin: v.string()
    },
    handler: async (ctx, args) => {
        const historial = await ctx.db.query('historialRutinas')
            .filter((q) => q.eq(q.field('uid'), args.uid))
            .collect();
        
        // Filtrar por rango de fechas
        const historialFiltrado = historial.filter(h => {
            const [dia, mes, anio] = h.fecha.split('/');
            const fechaHistorial = new Date(`${anio}-${mes}-${dia}`);
            const [diaInicio, mesInicio, anioInicio] = args.fechaInicio.split('/');
            const fechaInicio = new Date(`${anioInicio}-${mesInicio}-${diaInicio}`);
            const [diaFin, mesFin, anioFin] = args.fechaFin.split('/');
            const fechaFin = new Date(`${anioFin}-${mesFin}-${diaFin}`);
            
            return fechaHistorial >= fechaInicio && fechaHistorial <= fechaFin;
        });

        // Calcular estadísticas
        const totalEntrenamientos = historialFiltrado.length;
        const volumenTotal = historialFiltrado.reduce((sum, h) => sum + h.volumenTotal, 0);
        const duracionTotal = historialFiltrado.reduce((sum, h) => sum + h.duracion, 0);
        
        // Calcular ejercicios más realizados
        const ejerciciosCount = {};
        historialFiltrado.forEach(h => {
            h.ejerciciosRealizados.forEach(ej => {
                ejerciciosCount[ej.ejercicioId] = (ejerciciosCount[ej.ejercicioId] || 0) + 1;
            });
        });

        return {
            totalEntrenamientos,
            volumenTotal,
            duracionTotal,
            historial: historialFiltrado,
            ejerciciosMasRealizados: ejerciciosCount
        };
    }
});
