import type { Route } from "./+types/dashboard";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/shared/app-sidebar";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { trpcClient } from "~/utils/trpc";

export async function clientLoader() {
  try {
    const session = await trpcClient.auth.getSession.query();
    return { session: session.user };
  } catch (error) {
    return { session: null };
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { session } = loaderData;
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session]);

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          email: session?.email || "",
          name: session?.name || "",
        }}
      />
      <main className="w-full p-4">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
