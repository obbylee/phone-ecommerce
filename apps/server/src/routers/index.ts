import { z } from "zod";
import prisma from "../../prisma";
import { publicProcedure, router } from "../lib/trpc";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "Connection OK!";
  }),
  product: {
    list: publicProcedure
      .input(
        z.object({
          key: z.string().nullish(),
          minPrice: z.number().nullish(),
          maxPrice: z.number().nullish(),
          minOrder: z.number().nullish(),
        })
      )
      .query(async ({ input }) => {
        const whereConditions = {};
        if (input.key) {
          Object.assign(whereConditions, {
            OR: [
              { slug: { contains: input.key, mode: "insensitive" } },
              { name: { contains: input.key, mode: "insensitive" } },
              { description: { contains: input.key, mode: "insensitive" } },
            ],
          });
        }

        if (input.minPrice) {
          Object.assign(whereConditions, { price: { gte: input.minPrice } });
        }

        if (input.maxPrice) {
          Object.assign(whereConditions, { price: { lte: input.maxPrice } });
        }
        if (input.minOrder) {
          Object.assign(whereConditions, {
            minimumOrderQuantity: { gte: input.minOrder },
          });
        }

        const products = await prisma.product.findMany({
          where: whereConditions,
        });
        return products;
      }),
    bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      const product = await prisma.product.findFirst({
        where: { OR: [{ slug: input }, { name: input }] },
      });
      console.log(product);
      return product;
    }),
    // search: publicProcedure.input()
    create: publicProcedure
      .input(
        z.object({
          sku: z.string(),
          slug: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.number(),
          imageUrl: z.string(),
          stockQuantity: z.number(),
          minimumOrderQuantity: z.number(),
          isFeatured: z.boolean(),
          isActive: z.boolean(),
          category: z.string(),
          userId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await prisma.product.create({
          data: input,
        });
        return result;
      }),
    update: publicProcedure
      .input(
        z.object({
          sku: z.string(),
          slug: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.number(),
          imageUrl: z.string(),
          stockQuantity: z.number(),
          minimumOrderQuantity: z.number(),
          isFeatured: z.boolean(),
          isActive: z.boolean(),
          category: z.string(),
          userId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await prisma.product.update({
          where: { sku: input.sku },
          data: input,
        });
        return result;
      }),
  },
});

export type AppRouter = typeof appRouter;
