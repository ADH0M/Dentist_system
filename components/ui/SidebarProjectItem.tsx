import { Folder, Calendar, Tag } from "lucide-react";
import Link from "next/link";

interface SidebarProjectItemProps {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  isActive?: boolean;
  order:number;
}

interface SidebarProjectsSectionProps {
  projects: SidebarProjectItemProps[] | null;
  isLoading?: boolean;
}

export function SidebarProjectItem({
  id,
  title,
  type,
  createdAt,
  isActive,
}: SidebarProjectItemProps) {
  return (
    <Link
      href={`/projects/${id}`}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <Folder
        className={`h-4 w-4 shrink-0 ${
          isActive
            ? "text-primary-foreground"
            : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
        }`}
      />

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] opacity-80">
            <Tag className="h-2.5 w-2.5" />
            {type}
          </span>
          <span className="flex items-center gap-1 text-[11px] opacity-80">
            <Calendar className="h-2.5 w-2.5" />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

import { usePathname } from "next/navigation";

export function SidebarProjectsSection({
  projects,
  isLoading = false,
}: SidebarProjectsSectionProps) {
  const pathname = usePathname();

  return (
    <div className="mt-2">
      <div className="px-3 mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your Projects
        </h3>
      </div>

      <div className="space-y-1">
        {isLoading || !projects ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent/10 animate-pulse"
              >
                <div className="h-4 w-4 rounded bg-muted shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 rounded bg-muted"></div>
                  <div className="flex gap-2">
                    <div className="h-2 w-10 rounded bg-muted/60"></div>
                    <div className="h-2 w-12 rounded bg-muted/60"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : projects.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground text-center">
            No projects yet
          </div>
        ) : (
          projects.map((pr) => (
            <SidebarProjectItem
              key={pr.id}
              id={pr.id}
              order={pr.order}
              title={pr.title}
              type={pr.type || "Project"}
              createdAt={pr.createdAt}
              isActive={pathname === `/projects/${pr.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
