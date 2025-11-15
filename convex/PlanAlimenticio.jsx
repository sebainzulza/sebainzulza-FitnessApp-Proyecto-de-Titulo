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
        status: v.boolean(),
        calorias: v.number(),
        proteinas: v.number(),
        carbohidratos: v.number(),
        grasas: v.number(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.id, {
            status: args.status,
            calorias: args.calorias,
            proteinas: args.proteinas,
            carbohidratos: args.carbohidratos,
            grasas: args.grasas
        });
    }
})

export const GetTotalCaloriasConsumidas = query({
    args: {
        fecha:v.string(),
        uid: v.id('Users') 
    },
    handler: async (ctx, args) => {
        const planAlimenticioResult = await ctx.db.query('planAlimenticio')
            .filter(q =>
                q.and(
                    q.eq(q.field('uid'), args.uid),
                    q.eq(q.field('fecha'), args.fecha),
                    q.eq(q.field('status'), true)
                )
            )
            .collect();

        const totalCalorias = planAlimenticioResult.reduce((sum, comida) => sum + (comida.calorias ?? 0), 0);
        const totalProteinas = planAlimenticioResult.reduce((sum, comida) => sum + (comida.proteinas ?? 0), 0);
        const totalCarbohidratos = planAlimenticioResult.reduce((sum, comida) => sum + (comida.carbohidratos ?? 0), 0);
        const totalGrasas = planAlimenticioResult.reduce((sum, comida) => sum + (comida.grasas ?? 0), 0);

        return {
            calorias: totalCalorias,
            proteinas: totalProteinas,
            carbohidratos: totalCarbohidratos,
            grasas: totalGrasas
        };
    }
})

export const EliminarPlanAlimenticio = mutation({
    args: {
        id: v.id('planAlimenticio')
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    }
})

export const GetEstadisticasAlimenticiasPorPeriodo = query({
    args: {
        uid: v.id('Users'),
        fechaInicio: v.string(),
        fechaFin: v.string()
    },
    handler: async (ctx, args) => {
        const planesAlimenticios = await ctx.db.query('planAlimenticio')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .collect();

        // Filtrar por rango de fechas y solo los completados
        const planesEnRango = planesAlimenticios.filter(plan => {
            if (!plan.status) return false; // Solo contar los marcados como completados
            
            const [dia, mes, anio] = plan.fecha.split('/');
            const fechaPlan = new Date(`${anio}-${mes}-${dia}`);
            const [diaInicio, mesInicio, anioInicio] = args.fechaInicio.split('/');
            const fechaInicio = new Date(`${anioInicio}-${mesInicio}-${diaInicio}`);
            const [diaFin, mesFin, anioFin] = args.fechaFin.split('/');
            const fechaFin = new Date(`${anioFin}-${mesFin}-${diaFin}`);
            
            return fechaPlan >= fechaInicio && fechaPlan <= fechaFin;
        });

        // Agrupar por fecha
        const porFecha = {};
        planesEnRango.forEach(plan => {
            if (!porFecha[plan.fecha]) {
                porFecha[plan.fecha] = {
                    calorias: 0,
                    proteinas: 0,
                    carbohidratos: 0,
                    grasas: 0,
                    comidas: 0
                };
            }
            porFecha[plan.fecha].calorias += plan.calorias || 0;
            porFecha[plan.fecha].proteinas += plan.proteinas || 0;
            porFecha[plan.fecha].carbohidratos += plan.carbohidratos || 0;
            porFecha[plan.fecha].grasas += plan.grasas || 0;
            porFecha[plan.fecha].comidas += 1;
        });

        // Calcular totales
        const totalCalorias = planesEnRango.reduce((sum, p) => sum + (p.calorias || 0), 0);
        const totalProteinas = planesEnRango.reduce((sum, p) => sum + (p.proteinas || 0), 0);
        const totalCarbohidratos = planesEnRango.reduce((sum, p) => sum + (p.carbohidratos || 0), 0);
        const totalGrasas = planesEnRango.reduce((sum, p) => sum + (p.grasas || 0), 0);
        const totalComidas = planesEnRango.length;

        return {
            totalCalorias,
            totalProteinas,
            totalCarbohidratos,
            totalGrasas,
            totalComidas,
            porFecha,
            diasConDatos: Object.keys(porFecha).length
        };
    }
})