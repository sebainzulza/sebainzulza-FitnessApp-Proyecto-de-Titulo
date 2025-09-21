import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CrearPlanAlimenticio = mutation({
    args:{
        recetaId: v.id('recetas'),
        fecha: v.string(),
        comidaTipo: v.string(),
        uid: v.id('Users')
    },
    handler: async(ctx,args)=>{
        const result = await ctx.db.insert('planAlimenticio',{
            recetaId: args.recetaId,
            fecha: args.fecha,
            comidaTipo: args.comidaTipo,
            uid: args.uid
        });
        return result;
    }
})