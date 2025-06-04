import type { Route } from "./+types/main";
import { Link, NavLink, Outlet } from "react-router";
import { NavUser } from "../shared/nav-user";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { trpcClient } from "~/utils/trpc";

export async function clientLoader() {
  try {
    const session = await trpcClient.auth.getSession.query();
    return { response: session.user };
  } catch (error) {
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

          {response && response.hasOwnProperty("email") ? (
            <NavUser
              user={{
                name: response.name,
                email: response.email,
                avatar:
                  `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${response.name}&size=64` ||
                  "https://github.com/shadcn.png",
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
