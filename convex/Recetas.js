import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CrearNuevaReceta = mutation({
    args: {
        jsonData: v.any(),
        uid: v.id('Users'),
        recetaNombre: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('recetas', {
            jsonData: args.jsonData,
            uid: args.uid,
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

export const GetTodasLasRecetas = query({
    handler: async(ctx,args) =>{
        const result = await ctx.db.query('recetas').collect();
        return result
    }
})
