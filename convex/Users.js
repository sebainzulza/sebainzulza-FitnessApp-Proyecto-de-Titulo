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
            const result = await ctx.db.insert('Users', {
                ...data
            });

            return data;
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