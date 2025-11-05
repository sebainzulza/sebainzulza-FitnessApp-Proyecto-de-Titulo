import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        email: v.string(),
        name: v.string()
    },

    handler: async (ctx, args) => {
        const user = await ctx.db.query('Users')
            .filter(q => q.eq(q.field('email'), args.email))
            .collect()

        if (user?.length == 0) {
            const data = {
                name: args.name,
                email: args.email,
                credits: 10
            };
            const insertedId = await ctx.db.insert('Users', {
                ...data
            });

            // Return the document shape expected by the client, including _id
            return { _id: insertedId, ...data };
        }
        return user[0];
    }
})

export const GetUser = query({
    args:{
        email: v.string()
    },
    handler:async (ctx,args)=>{
        const user = await ctx.db.query('Users')
            .filter(q => q.eq(q.field('email'), args.email))
            .collect()

        return user[0];
    }
})

export const UpdateUserPref=mutation({
    args:{
        uid: v.id('Users'),
        altura: v.string(),
        peso: v.string(),
        genero: v.string(),
        objetivo: v.string(),
        diasEntrenamientoPorSemana: v.string(),
        edad: v.number(),
        calorias: v.number(),
        proteinas: v.number(),
        carbohidratos: v.number(),
        grasas: v.number()
    },
    handler:async (ctx,args)=>{
        const result = await ctx.db.patch(args.uid, {
            altura: args.altura,
            peso: args.peso,
            genero: args.genero,
            objetivo: args.objetivo,
            diasEntrenamientoPorSemana: args.diasEntrenamientoPorSemana,
            edad: args.edad,
            calorias: args.calorias,
            proteinas: args.proteinas,
            carbohidratos: args.carbohidratos,  
            grasas: args.grasas
        });

        return result;
    }
})

export const UpdateUserConsent = mutation({
    args: {
        uid: v.id('Users'),
        acceptedTermsAt: v.optional(v.number()),
        aiDisclaimerAcknowledgedAt: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const { uid, acceptedTermsAt, aiDisclaimerAcknowledgedAt } = args;
        const result = await ctx.db.patch(uid, {
            ...(acceptedTermsAt !== undefined ? { acceptedTermsAt } : {}),
            ...(aiDisclaimerAcknowledgedAt !== undefined ? { aiDisclaimerAcknowledgedAt } : {}),
        });
        return result;
    }
})

export const DeleteUser = mutation({
    args: {
        uid: v.id('Users')
    },
    handler: async (ctx, args) => {
        // Eliminar todos los planes alimenticios asociados al usuario
        const planesAlimenticios = await ctx.db.query('planAlimenticio')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .collect();
        
        for (const plan of planesAlimenticios) {
            await ctx.db.delete(plan._id);
        }

        // Eliminar todas las recetas asociadas al usuario
        const recetas = await ctx.db.query('recetas')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .collect();
        
        for (const receta of recetas) {
            await ctx.db.delete(receta._id);
        }

        // Finalmente, eliminar el usuario
        await ctx.db.delete(args.uid);
        
        return { success: true };
    }
})