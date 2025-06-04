import { z } from "zod";
import prisma from "../../prisma";
import { publicProcedure, protectedProcedure, router } from "../lib/trpc";
import { auth } from "../lib/auth";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "Connection OK!";
  }),
  auth: {
    getSession: protectedProcedure.query(({ ctx }) => {
      return {
        message: "User Authenticated!",
        user: ctx.session.user,
      };
    }),
    login: publicProcedure
      .input(
        z.object({
          email: z
            .string()
            .min(1, "This field is required.")
            .email("This is not a valid email."),
          password: z
            .string()
            .min(8, "Password must be atleast 8 characters long."),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        try {
          const betterAuthResponse = await auth.api.signInEmail({
            body: {
              email,
              password,
            },
            asResponse: true, // returns a response object instead of data
          });

          if (!betterAuthResponse.ok) {
            const errorData = await betterAuthResponse.json();
            throw new Error(
              errorData.message ||
                "Authentication failed due to invalid credentials."
            );
          }

          const setCookieHeaders = betterAuthResponse.headers.getSetCookie();

          setCookieHeaders.forEach((cookieString) => {
            ctx.honoContext.header("Set-Cookie", cookieString, {
              append: true,
            });
          });

          return { success: true, message: "User authenticated!" };
        } catch (error) {
          if (error instanceof Error) {
            return { success: false, message: error.message };
          }
          return { success: false, message: "Internal server error" };
        }
      }),
    register: publicProcedure
      .input(
        z.object({
          email: z
            .string()
            .min(1, "This field is required.")
            .email("This is not a valid email."),
          password: z
            .string()
            .min(8, "Password must be atleast 8 characters long."),
          name: z.string().min(1, "This field is required."),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { email, password, name } = input;
        try {
          const betterAuthResponse = await auth.api.signUpEmail({
            body: {
              email,
              password,
              name,
            },
            asResponse: true, // returns a response object instead of data
          });

          if (!betterAuthResponse.ok) {
            const errorData = await betterAuthResponse.json();
            throw new Error(errorData.message || "Authentication failed");
          }

          const setCookieHeaders = betterAuthResponse.headers.getSetCookie();

          setCookieHeaders.forEach((cookieString) => {
            ctx.honoContext.header("Set-Cookie", cookieString, {
              append: true,
            });
          });

          return { success: true, message: "User registered!" };
        } catch (error) {
          if (error instanceof Error) {
            return { success: false, message: error.message };
          }
          return { success: false, message: "Internal server error" };
        }
      }),
    logout: protectedProcedure.query(async ({ ctx }) => {
      const signOutResponse = await auth.api.signOut({
        headers: ctx.honoContext.req.raw.headers, // Pass current request headers for session identification
        asResponse: true,
      });

      // These headers will typically have Max-Age=0 or an expired date.
      const setCookieHeaders = signOutResponse.headers.getSetCookie();

      // This is how the browser receives the instruction to delete the cookie.
      setCookieHeaders.forEach((cookieString) => {
        ctx.honoContext.header("Set-Cookie", cookieString, { append: true });
      });

      // BetterAuth handles the server-side invalidation of the session internally
      // when `signOut` is called.
      return { success: true, message: "Logged out successfully!" };
    }),
  },
  product: {
    list: publicProcedure
      .input(
        z.object({
          key: z.string().nullish(),
          minPrice: z.number().nullish(),
          maxPrice: z.number().nullish(),
          minOrder: z.number().nullish(),
          categories: z.array(z.string().nullish()),
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

        if (input.categories && input.categories.length > 0) {
          Object.assign(whereConditions, {
            categoryId: {
              in: input.categories,
            },
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
          categoryId: z.string(),
          userId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await prisma.product.create({
          data: input,
        });
        return result;
      }),
    categories: publicProcedure.query(async () => {
      const result = await prisma.productCategory.findMany();
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
          categoryId: z.string(),
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
  admin: {
    product: {
      list: publicProcedure.query(async () => {
        const products = await prisma.product.findMany();
        return products;
      }),
    },
  },
  cart: {
    getCart: protectedProcedure.query(async ({ ctx }) => {
      const cart = await prisma.cart.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          items: {
            include: {
              product: {
                // Include product details for each item in the cart
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  price: true,
                  imageUrl: true,
                  stockQuantity: true,
                  minimumOrderQuantity: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        return {
          id: null,
          userId: "",
          items: [],
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString(),
        };
      }

      return cart;
    }),
    addToCart: protectedProcedure
      .input(
        z.object({
          productId: z.string(),
          quantity: z.number().int().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { productId, quantity } = input;

        // Use a transaction
        const cartOperationResult = await prisma.$transaction(async (tx) => {
          let cart = await tx.cart.findUnique({
            where: { userId: ctx.session?.user.id },
          });

          if (!cart) {
            const userExists = await tx.user.findUnique({
              where: { id: ctx.session.user.id },
            });

            if (!userExists) {
              throw new Error("User not found. Cannot create cart.");
            }
            // create cart
            cart = await tx.cart.create({
              data: { userId: ctx.session.user.id },
            });
          }

          const product = await tx.product.findUnique({
            where: { id: productId },
          });

          if (!product) {
            throw new Error("Product not found.");
          }

          if (quantity < product.minimumOrderQuantity) {
            throw new Error(
              `Minimum order quantity for ${product.name} is ${product.minimumOrderQuantity}.`
            );
          }
          if (product.stockQuantity < quantity) {
            throw new Error(
              `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
            );
          }

          const existingCartItem = await tx.cartItem.findUnique({
            where: {
              cartId_productId: { cartId: cart.id, productId: productId },
            },
          });

          let updatedCartItem;
          if (existingCartItem) {
            updatedCartItem = await tx.cartItem.update({
              where: { id: existingCartItem.id },
              data: { quantity: existingCartItem.quantity + quantity },
            });
          } else {
            updatedCartItem = await tx.cartItem.create({
              data: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity,
              },
            });
          }

          await tx.product.update({
            where: { id: productId },
            data: { stockQuantity: { decrement: quantity } },
          });

          return { cart, updatedCartItem };
        });

        return {
          message: "Product added to cart successfully!",
          cartId: cartOperationResult.cart.id,
          cartItem: cartOperationResult.updatedCartItem,
        };
      }),
  },
});

export type AppRouter = typeof appRouter;
