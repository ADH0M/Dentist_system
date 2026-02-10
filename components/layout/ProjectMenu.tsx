"use client";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@radix-ui/react-menubar";

interface ProjectMenuProps {
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
}

export default function ProjectMenu({
  setUpdate,
  handleDelete,
}: ProjectMenuProps) {
  return (
    <Menubar className="h-6 border-0 bg-transparent p-0">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md text-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label="Project options"
          >
            <EllipsisVertical className="h-3.5 w-3.5" />
          </Button>
        </MenubarTrigger>

        <MenubarContent
          align="end"
          sideOffset={4}
          className="z-50 min-w-[140px] p-1 rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in slide-in-from-top-1"
        >
          <MenubarItem
            onClick={() => {
              setUpdate(true);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md cursor-pointer outline-none focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-highlighted:bg-sidebar-accent data-highlighted:text-sidebar-accent-foreground"
          >
            <Pencil className="h-3 w-3 shrink-0" />
            <span>Edit</span>
          </MenubarItem>

          <MenubarItem
            className="flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md text-destructive 
          cursor-pointer outline-none focus:bg-destructive/10 focus:text-destructive 
          data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
            onClick={() => {
              handleDelete();
            }}
          >
            <Trash2 className="h-3 w-3 shrink-0" />
            <span>Delete</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
