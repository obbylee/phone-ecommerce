import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/index";
import prisma from "../prisma/index";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";

const ALLOWED_CORS = [
  process.env.CORS_ORIGIN ?? "",
  process.env.BETTER_AUTH_URL ?? "",
];

const app = new Hono();

app.use(logger());

app.use(cors());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

app.get("/", async (c) => {
  try {
    const product = await prisma.product.findMany();
    return c.json({ message: "Server Connected!", data: product });
  } catch (error) {
    return c.json({ message: "Server Connected!", data: null });
  }
});

export default app;
