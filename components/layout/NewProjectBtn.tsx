import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { createProject } from "@/lib/actions/projects";
import { cn } from "@/lib/utils";


const NewProjectBtn = ({
  className,
  newClassName,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  userId,
}: {
  className: string;
  newClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  userId: string | undefined;
}) => {
  return (
    <Menubar className={className}>
      <MenubarMenu>
        <MenubarTrigger className="">New project</MenubarTrigger>
        <MenubarContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn(
            "border border-border w-56 md:w-72 mt-2 *:cursor-pointer",
            newClassName
          )}
        >
          <MenubarItem
            className="p-1 md:p-3"
            onClick={async () => {
              const type = "todo";
              if (userId) await createProject(type, userId);
            }}
          >
            Todo
            <MenubarShortcut>⌘default</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />
          <MenubarItem className="p-1 md:p-3">Task Tracker</MenubarItem>
          <MenubarSeparator />

          <MenubarItem className="p-1 md:p-3">
            Project Tracker <MenubarShortcut>⌘Kanban</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />
          <MenubarItem className="p-1 md:p-3">Meeting Notes</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default NewProjectBtn;
