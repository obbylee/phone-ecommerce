import type { Route } from "./+types/main";
import { authClient } from "~/lib/auth-client";
import { Link, NavLink, Outlet } from "react-router";
import { toast } from "sonner";
import { NavUser } from "../shared/nav-user";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

export async function clientLoader() {
  try {
    const { data: session, error } = await authClient.getSession();
    if (!session) return { response: null };

    if (error) throw new Error("something wrong");

    return { response: session };
  } catch (error) {
    if (error instanceof Error) {
      toast.error("No access allowed!");
    }
    return { response: null };
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { response } = loaderData;
  return (
    <>
      <header className="mx-auto max-w-[1200px] flex justify-between items-center bg-white dark:bg-black sticky top-0">
        <a href="/" className="p-4 font-medium text-xl sm:text-2xl">
          Aliphone.com
        </a>
        <nav className="flex justify-center items-center gap-4 p-4">
          <NavLink to="product" viewTransition>
            Product
          </NavLink>

          {response && response.hasOwnProperty("user") ? (
            <NavUser
              user={{
                name: response.user.name,
                email: response.user.email,
                avatar: response.user.image || "https://github.com/shadcn.png",
              }}
            />
          ) : (
            <>
              <div className="hidden md:flex md:gap-2">
                <Button size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>

              <div className="block md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Register</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </nav>
      </header>

      <Outlet />

      <div className="m-20" />

      <footer className="container bg-white dark:bg-black fixed bottom-0 text-center">
        Aliphone.com &copy; 2025
      </footer>
    </>
  );
}
