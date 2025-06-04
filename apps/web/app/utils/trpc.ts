import type { AppRouter } from "../../../server/src/routers/index";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_SERVER_URL}/api`,
      fetch: (url, options) => {
        // Explicitly cast `options` to `RequestInit` to satisfy TypeScript
        // when spreading its properties into the fetch options object.
        const fetchOptions: RequestInit = {
          ...(options as RequestInit),
          credentials: "include",
        };
        return fetch(url, fetchOptions);
      },
    }),
  ],
});
