"use client";

import {
  LayoutDashboard,
  Rocket,
  Terminal,
  HardDriveDownload,
  Satellite,
  SatelliteDish,
  UsersRound,
  Database,
} from "lucide-react";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";

type IMenuSection = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

const sections: { title?: string; items: IMenuSection[] }[] = [
  {
    items: [
      {
        title: "Irányítópult",
        url: "/",
        icon: LayoutDashboard,
        isActive: true,
      },
    ],
  },
  {
    title: "Küldetésirányítás",
    items: [
      {
        title: "Küldetések",
        url: "/missions",
        icon: Rocket,
        items: [
          {
            title: "Küldetések megtekintése",
            url: "/missions",
          },
          {
            title: "Új küldetés létrehozása",
            url: "/missions/create",
          },
        ],
      },
      {
        title: "Parancsok",
        url: "/commands",
        icon: Terminal,
        items: [
          {
            title: "Parancsok megtekintése",
            url: "/commands",
          },
          {
            title: "Új parancs felküldése",
            url: "/commands/create",
          },
        ],
      },
      {
        title: "Packetek",
        url: "/packets",
        icon: HardDriveDownload,
        items: [
          {
            title: "Packetek megtekintése",
            url: "/packets",
          },
          {
            title: "Packetek importálása",
            url: "/packets/import",
          },
        ],
      },
      {
        title: "Eszközök",
        url: "# ",
        icon: Satellite,
        items: [
          {
            title: "BME Hunity",
            url: "# ",
          },
          {
            title: "Onionsat Teszt",
            url: "# ",
          },
          {
            title: "Sloth",
            url: "# ",
          },
        ],
      },
      {
        title: "Komm. ablakok",
        url: "# ",
        icon: SatelliteDish,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Felhasználók",
        icon: UsersRound,
        url: "/users",
      },
      {
        title: "Tárhely kezelése",
        icon: Database,
        url: "#",
      },
    ],
  },
];

function MenuSection({
  items,
  title,
}: {
  items: IMenuSection[];
  title: string | null;
}) {
  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMain() {
  return (
    <>
      {sections.map((section, idx) => (
        <MenuSection
          key={idx}
          items={section.items}
          title={section.title ?? null}
        />
      ))}
    </>
  );
}
