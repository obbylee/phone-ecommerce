import type { AppRouter } from "../../../server/src/routers/index";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_SERVER_URL}/api/trpc/`,
    }),
  ],
});
