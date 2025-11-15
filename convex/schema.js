import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    Users: defineTable({
        name: v.string(),
        email: v.string(),
        picture: v.optional(v.string()),
        subscriptionId: v.optional(v.string()),
        credits: v.optional(v.number()),
        acceptedTermsAt: v.optional(v.number()),
        aiDisclaimerAcknowledgedAt: v.optional(v.number()),
        altura: v.optional(v.string()),
        peso: v.optional(v.string()),
        genero: v.optional(v.string()),
        objetivo: v.optional(v.string()),
        diasEntrenamientoPorSemana: v.optional(v.string()),
        edad: v.optional(v.number()),
        calorias: v.optional(v.number()),
        proteinas: v.optional(v.number()),
        carbohidratos: v.optional(v.number()),
        grasas: v.optional(v.number())
    }),

    recetas: defineTable({
        jsonData: v.any(),
        uid: v.id('Users'),
        recetaNombre: v.any()
    }),

    planAlimenticio: defineTable({
        recetaId: v.id('recetas'),
        fecha: v.string(),
        comidaTipo: v.string(),
        uid: v.id('Users'),
        status: v.optional(v.boolean()),
        calorias:v.optional(v.number()),
        proteinas:v.optional(v.number()),
        carbohidratos:v.optional(v.number()),
        grasas:v.optional(v.number())
    }),

    rutinas: defineTable({
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
        fechaCreacion: v.number(),
    }),

    historialRutinas: defineTable({
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
    })
})