import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CrearPlanAlimenticio = mutation({
    args: {
        recetaId: v.id('recetas'),
        fecha: v.string(),
        comidaTipo: v.string(),
        uid: v.id('Users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('planAlimenticio', {
            recetaId: args.recetaId,
            fecha: args.fecha,
            comidaTipo: args.comidaTipo,
            uid: args.uid
        });
        return result;
    }
})

export const GetPlanAlimenticioHoy = query({
    args: {
        uid: v.id('Users'),
        fecha: v.string()
    },
    handler: async (ctx, args) => {
        //Todos los planes alimenticios
        const planesAlimenticios = await ctx.db.query('planAlimenticio')
            .filter(q =>
                q.and(
                    q.eq(q.field('uid'), args.uid),
                    q.eq(q.field('fecha'), args.fecha)
                )
            )
            .collect();

        //Recetas asociadas al plan
        const result = await Promise.all(
            planesAlimenticios.map(async (planAlimenticio) => {
                const receta = await ctx.db.get(planAlimenticio.recetaId);
                return {
                    planAlimenticio,
                    receta
                }
            })
        )

        return result;
    }
});

export const actualizarStatus = mutation({
    args: {
        id: v.id('planAlimenticio'),
        status: v.boolean()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.id, {
            status: args.status
        });
    }
})