import { getProject } from "@/lib/actions/projects";
import { TodoList } from "@/pages/projects/Todo";
import { cookies } from "next/headers";
import { redirect, unauthorized } from "next/navigation";

export default async function TodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookiesStore = await cookies();
  const userId = cookiesStore.get("userId")?.value;
  if (!userId) {
    redirect("/");
  }
  if (!id) {
    redirect("/projects");
  }
  const project = await getProject(userId, id);
  console.log(userId);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      <TodoList />
    </div>
  );
}
