import { Context as HonoContext } from "hono";
import { auth } from "./auth";

export type CreateContextOptions = {
  honoContext: HonoContext;
};

export async function createContext({ honoContext }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: honoContext.req.raw.headers,
  });
  return {
    session,
    honoContext,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
