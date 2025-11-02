"use client";

import { useState } from "react";
import Link from "next/link"; // ✅ Import Link
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/src/app/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

const items = [
  { title: "Schools", url: "/schools", icon: Home },
  { title: "Users", url: "/users ", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sidebar collapsible='icon' className='bg-white'>
      <SidebarContent className='bg-white'>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* ✅ Collapsible Section */}
            <SidebarMenu>
              <Collapsible open={open} onOpenChange={setOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Calendar className='mr-2 h-4 w-4' />
                      <span>Projects</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          {/* ✅ Use Link instead of <a> */}
                          <Link href='/projects/a'>Project A</Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link href='/projects/b'>Project B</Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>

            {/* ✅ Regular menu items */}
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
