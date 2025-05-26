import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/index";
import prisma from "../prisma/index";

const app = new Hono().basePath("/api");

app.use(logger());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "OPTIONS"],
  })
);

app.use(
  // "/trpc/*",
  trpcServer({
    router: appRouter,
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
