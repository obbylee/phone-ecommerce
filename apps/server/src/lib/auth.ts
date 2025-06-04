import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../prisma/generated/prisma-client-js";

const ALLOWED_CORS = [
  process.env.CORS_ORIGIN ?? "",
  process.env.BETTER_AUTH_URL ?? "",
];

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ALLOWED_CORS,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true, // Usually good to keep this true
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN,
  },
});
