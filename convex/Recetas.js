import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CrearNuevaReceta = mutation({
    args: {
        jsonData: v.any(),
        uid: v.id('Users'),
        imagenUrl: v.string(),
        recetaNombre: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('recetas', {
            jsonData: args.jsonData,
            uid: args.uid,
            imagenUrl: args.imagenUrl,
            recetaNombre: args.recetaNombre
        });
        return result;
    }
})

export const GetRecetaById = query({
    args: {
        id: v.id('recetas')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
})