"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/generated/prisma";

export function DropdownMenuSubmenu({
  labels = [],
  mainTile = "",
  panel_position = "",
  method,
  userId,
  value
}: {
  labels: { label: UserType; key: UserType }[];
  mainTile: string;
  panel_position: string;
  method?: (userId: string, userRole: UserType) => Promise<void>;
  userId?: string;
  value?:string
}) {
  const [position, setPosition] = React.useState(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{mainTile}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{panel_position}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            {labels.map((lab, ind) => (
              <DropdownMenuRadioItem
                onClick={() => method && method(userId!, lab.label)}
                value={lab.key}
                key={lab.key + " " + ind}
              >
                {lab.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
