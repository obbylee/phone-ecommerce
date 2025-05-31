import type { Route } from "./+types/dashboard";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/shared/app-sidebar";
import { Outlet, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
import { useEffect } from "react";
import Loader from "../shared/loader";

export default function Route() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending]);

  if (isPending) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-4">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
