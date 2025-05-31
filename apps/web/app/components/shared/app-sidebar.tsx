import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Book, Home, Package } from "lucide-react";
import { NavLink } from "react-router";
import { NavUser } from "./nav-user";
import { authClient } from "~/lib/auth-client";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Product",
    url: "/admin/product",
    icon: Book,
  },
];

export function AppSidebar() {
  const { data, isPending } = authClient.useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!py-6" //2.5
            >
              <NavLink to="/" viewTransition>
                <Package className="h-5 w-5" />
                <span className="text-base font-semibold">Aliphone.com</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {isPending ? (
          <div>Loading ...</div>
        ) : (
          <NavUser
            user={{
              name: data?.user.name || "shadcn",
              email: data?.user.email || "m@example.com",
              avatar: data?.user.image || "https://github.com/shadcn.png",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
