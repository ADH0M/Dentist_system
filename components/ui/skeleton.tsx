import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}


export function ProjectsSkeleton() {
  return (
    <div className="flex mt-2 items-center space-x-2 w-full">
      <div className="space-y-2">
        <Skeleton className="h-8 bg-accent w-[220]" />
        <Skeleton className="h-8 bg-accent w-[220]" />
        <Skeleton className="h-8 bg-accent w-[220]" />
        <Skeleton className="h-8 bg-accent w-[220]" />
      </div>
    </div>
  );
}

export { Skeleton };
