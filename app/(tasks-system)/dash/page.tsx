import Column from "@/components/kanban/Column";
import prisma from "@/lib/db/db-connection";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const page = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) redirect("/");
  const getColumns = await prisma.column.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      tasks: true,
      order: true,
      title: true,
      _count: true,
      userId:true,
      user: true,
    },
  });

  console.log(getColumns);

  return (
    <div className="text-secondary flex m-20">
      <Suspense
        fallback={
          <div className="bg-sidebar-primary h-96 w-96 animate-pulse border border-border">
            loading...
          </div>
        }
      >
        {getColumns.map((column) => (
          <div key={column.id}>
            <Column column={column}/>
          </div>
        ))}
      </Suspense>
    </div>
  );
};

export default page;
