import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    Users: defineTable({
        name: v.string(),
        email: v.string(),
        picture: v.optional(v.string()),
        subscriptionId: v.optional(v.string()),
        credits: v.optional(v.number()),
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
    })
})